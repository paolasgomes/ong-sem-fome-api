"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = void 0;
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos com paginação
 *     tags: [Products]
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
 *         description: Lista paginada de doadores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Donor'
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
const getAllProducts = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await (0, connection_1.db)('products')
            .select('*')
            .paginate({
            perPage: limit ? Number(limit) : 10,
            currentPage: page ? Number(page) : 1,
            isLengthAware: true,
        });
        const totalPages = result.pagination.lastPage || 1;
        const formattedData = await Promise.all(result.data.map(async (product) => {
            const category = product.category_id !== null && product.category_id !== undefined
                ? await (0, connection_1.db)('categories').where({ id: product.category_id }).first()
                : null;
            const { category_id, ...rest } = product;
            return {
                ...rest,
                category,
                is_active: Boolean(product?.is_active),
            };
        }));
        return res.json({
            results: formattedData,
            page: result.pagination.currentPage,
            limit: result.pagination.perPage,
            total: result.pagination.total,
            totalPages,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
};
exports.getAllProducts = getAllProducts;
