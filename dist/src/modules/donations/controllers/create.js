"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDonation = void 0;
const connection_1 = require("@/database/connection");
const create_1 = require("../schemas/create");
const checkForeignKey_1 = require("../utils/checkForeignKey");
/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Cria uma nova doação
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - donor_id
 *               - collaborator_id
 *             properties:
 *               type:
 *                 type: string
 *                 description: Tipo da doação
 *                 enum: ['food', 'clothing', 'money', 'campaign']
 *                 example: 'food'
 *               amount:
 *                 type: number
 *                 description: Valor da doação (se aplicável)
 *                 example: 50.0
 *               quantity:
 *                 type: integer
 *                 description: Quantidade do produto doado (se aplicável)
 *                 example: 3
 *               unit:
 *                 type: string
 *                 description: Unidade da quantidade do produto doado (se aplicável)
 *                 enum: ['kg', 'g', 'l', 'ml', 'un']
 *                 example: "kg"
 *               observations:
 *                 type: string
 *                 description: Observações sobre a doação
 *                 example: "Entrega somente aos sábados"
 *               donor_id:
 *                 type: integer
 *                 description: ID do doador (obrigatório)
 *                 example: 1
 *               collaborator_id:
 *                 type: integer
 *                 description: ID do colaborador que registrou a doação (obrigatório)
 *                 example: 2
 *               campaign_id:
 *                 type: integer
 *                 description: ID da campanha (opcional)
 *                 example: 5
 *               product_id:
 *                 type: integer
 *                 description: ID do produto (opcional)
 *                 example: 10
 *     responses:
 *       201:
 *         description: Doação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Recurso relacionado não encontrado (doador, colaborador, campanha ou produto)
 *       500:
 *         description: Erro interno do servidor
 */
const createDonation = async (req, res) => {
    try {
        const validation = create_1.createDonationSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: validation.error._zod,
            });
        }
        const { data } = validation;
        let foreignData = await (0, checkForeignKey_1.checkForeignKeyExistence)(data);
        if ('error' in foreignData) {
            return foreignData.error
                ? res.status(foreignData.error?.status).json(foreignData.error?.body)
                : null;
        }
        const insertPayload = {
            type: data.type,
            amount: data.amount,
            quantity: data.quantity,
            observations: data.observations,
            donor_id: data.donor_id,
            campaign_id: data.campaign_id,
            collaborator_id: data.collaborator_id,
            product_id: data.product_id,
            created_at: connection_1.db.fn.now(),
            updated_at: null,
        };
        let insertedId = undefined;
        await connection_1.db.transaction(async (trx) => {
            const [id] = await trx('donations').insert(insertPayload);
            insertedId = id;
            if (data.product_id && data.quantity && data.quantity > 0) {
                const updatedQuantity = (foreignData.product.in_stock || 0) + data.quantity;
                foreignData.product.in_stock = updatedQuantity;
                await trx('products')
                    .where({ id: data.product_id })
                    .update({ in_stock: updatedQuantity, updated_at: connection_1.db.fn.now() });
            }
        });
        if (!insertedId) {
            throw new Error('Não foi possível inserir a doação');
        }
        const donation = await (0, connection_1.db)('donations').where({ id: insertedId }).first();
        const { donor_id, collaborator_id, campaign_id, product_id, ...rest } = donation;
        const formattedDonation = {
            ...rest,
            donor: foreignData.donor,
            collaborator: foreignData.collaborator,
            campaign: foreignData.campaign ?? null,
            product: foreignData.product ?? null,
            amount: donation?.amount
                ? parseFloat(donation.amount)
                : null,
        };
        return res.status(201).json(formattedDonation);
    }
    catch (error) {
        console.error('Erro ao criar doação:', error);
        return res
            .status(500)
            .json({ error: 'Erro ao criar doação', details: error?.message });
    }
};
exports.createDonation = createDonation;
