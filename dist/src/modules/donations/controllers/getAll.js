"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDonations = void 0;
const connection_1 = require("@/database/connection");
const checkForeignKey_1 = require("../utils/checkForeignKey");
/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Lista todas as doações com paginação
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página atual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista paginada de doações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Family'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro ao buscar doadores
 */
const getAllDonations = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await (0, connection_1.db)('donations')
            .select('*')
            .paginate({
            perPage: limit ? Number(limit) : 10,
            currentPage: page ? Number(page) : 1,
            isLengthAware: true,
        });
        const totalPages = result.pagination.lastPage || 1;
        const formattedData = result.data.map(async (donation) => {
            const foreignData = await (0, checkForeignKey_1.checkForeignKeyExistence)(donation);
            const { donor_id, collaborator_id, campaign_id, product_id, ...rest } = donation;
            return {
                ...rest,
                donor: foreignData.donor,
                collaborator: foreignData.collaborator,
                campaign: foreignData.campaign ?? null,
                product: foreignData.product ?? null,
                amount: donation?.amount
                    ? parseFloat(donation.amount)
                    : null,
            };
        });
        return res.json({
            results: await Promise.all(formattedData),
            page: result.pagination.currentPage,
            limit: result.pagination.perPage,
            total: result.pagination.total,
            totalPages,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar doadores' });
    }
};
exports.getAllDonations = getAllDonations;
