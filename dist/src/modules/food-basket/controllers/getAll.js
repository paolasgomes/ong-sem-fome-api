"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFoodBaskets = void 0;
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /food-baskets:
 *   get:
 *     summary: Registra a distribuição de uma cesta de alimentos
 *     tags: [FoodBasketDistributions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - food_basket_id
 *             properties:
 *               food_basket_id:
 *                 type: integer
 *                 description: ID da cesta que será distribuída (itens definidos na cesta)
 *                 example: 1
 *               campaign_id:
 *                 type: integer
 *                 description: ID da campanha associada à distribuição (opcional)
 *                 example: 3
 *               collaborator_id:
 *                 type: integers
 *                 description: ID do colaborador que realizou a distribuição (opcional)
 *                 example: 2
 *               family_id:
 *                 type: integer
 *                 description: ID da família que recebeu a distribuição (opcional)
 *                 example: 5
 *               delivery_date:
 *                 type: string
 *                 format: date-time
 *                 description: Data/hora da distribuição (opcional)
 *                 example: "2025-11-21T14:30:00Z"
 *               observations:
 *                 type: string
 *                 description: Observações sobre a distribuição
 *                 example: "Entregue com conferência de documentos"
 *     responses:
 *       201:
 *         description: Distribuição registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Cesta ou produto não encontrado / Estoque insuficiente
 *       500:
 *         description: Erro interno do servidor
 */
const getAllFoodBaskets = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await (0, connection_1.db)('food_baskets')
            .select('*')
            .paginate({
            perPage: limit ? Number(limit) : 10,
            currentPage: page ? Number(page) : 1,
            isLengthAware: true,
        });
        const totalPages = result.pagination.lastPage || 1;
        const formattedData = result.data.map(async (basket) => {
            const items = await (0, connection_1.db)('food_baskets_items')
                .where({ food_basket_id: basket.id })
                .select('*');
            const formattedItems = await Promise.all(items
                .map(async (item) => {
                const product = await (0, connection_1.db)('products')
                    .where({ id: item.product_id })
                    .first();
                if (!product) {
                    return null;
                }
                return {
                    name: product.name,
                    quantity: item.quantity,
                };
            })
                .filter(Boolean));
            return {
                ...basket,
                is_active: Boolean(basket.is_active),
                items: formattedItems,
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
        console.error('Erro ao obter cestas de alimentos:', error);
        return res.status(500).json({
            error: 'Erro ao obter cestas de alimentos',
            details: error,
        });
    }
};
exports.getAllFoodBaskets = getAllFoodBaskets;
