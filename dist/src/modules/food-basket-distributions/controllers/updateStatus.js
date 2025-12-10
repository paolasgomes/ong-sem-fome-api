"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = void 0;
const updateStatus_1 = require("../schemas/updateStatus");
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /food-basket-distributions/status/{id}:
 *   patch:
 *     summary: Atualiza o status de uma distribuição de cesta de alimentos
 *     tags:
 *       - FoodBasketDistributions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da distribuição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, delivered, canceled]
 *                 description: Novo status da distribuição
 *                 example: delivered
 *     responses:
 *       '200':
 *         description: Status da distribuição atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Dados inválidos
 *       '404':
 *         description: Distribuição não encontrada
 *       '500':
 *         description: Erro interno do servidor
 */
const updateStatus = async (req, res) => {
    try {
        const { id: distributionId } = req.params;
        const validation = updateStatus_1.updateStatusSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: validation.error._zod,
            });
        }
        const { status } = validation.data;
        await (0, connection_1.db)('food_basket_distributions')
            .where({ id: distributionId })
            .update({ status, updated_at: connection_1.db.fn.now() });
        return res.status(200).json({
            message: 'Status da distribuição atualizado com sucesso',
        });
    }
    catch (error) {
        console.error('Erro ao atualizar status da distribuição:', error);
        return res.status(500).json({
            error: 'Erro ao atualizar status da distribuição',
            details: error,
        });
    }
};
exports.updateStatus = updateStatus;
