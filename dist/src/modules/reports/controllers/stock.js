"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockReport = void 0;
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /reports/stock:
 *   get:
 *     summary: Relatório de estoque dos produtos
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtro por nome do produto (busca parcial)
 *       - in: query
 *         name: category_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID da categoria do produto
 *       - in: query
 *         name: is_active
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filtrar produtos ativos/inativos
 *     responses:
 *       200:
 *         description: Relatório de estoque gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filters:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       nullable: true
 *                     category_id:
 *                       type: integer
 *                       nullable: true
 *                     is_active:
 *                       type: boolean
 *                       nullable: true
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total_products:
 *                       type: integer
 *                     total_in_stock:
 *                       type: integer
 *                     products_below_minimum:
 *                       type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       unit:
 *                         type: string
 *                         nullable: true
 *                       in_stock:
 *                         type: integer
 *                       minimum_stock:
 *                         type: integer
 *                         nullable: true
 *                       is_active:
 *                         type: boolean
 *                       category_id:
 *                         type: integer
 *                         nullable: true
 *                       category_name:
 *                         type: string
 *                         nullable: true
 *                       below_minimum:
 *                         type: boolean
 *                         description: Indica se o produto está abaixo do estoque mínimo
 *       500:
 *         description: Erro interno do servidor
 */
const getStockReport = async (req, res) => {
    try {
        const { name, category_id, is_active } = req.query;
        const query = (0, connection_1.db)('products')
            .leftJoin('categories', 'products.category_id', 'categories.id')
            .select('products.id', 'products.name', 'products.unit', 'products.in_stock', 'products.minimum_stock', 'products.is_active', 'products.category_id', 'categories.name as category_name');
        if (typeof name === 'string' && name.trim()) {
            query.whereILike('products.name', `%${name.trim()}%`);
        }
        if (typeof category_id === 'string' && !isNaN(Number(category_id))) {
            query.where('products.category_id', Number(category_id));
        }
        if (typeof is_active === 'string') {
            const normalized = is_active.toLowerCase();
            if (normalized === 'true' || normalized === 'false') {
                const activeFlag = normalized === 'true' ? 1 : 0;
                query.where('products.is_active', activeFlag);
            }
        }
        const products = await query;
        const totalProducts = products.length;
        const totalInStock = products.reduce((acc, product) => {
            const qty = typeof product.in_stock === 'number' ? product.in_stock : 0;
            return acc + qty;
        }, 0);
        const productsBelowMinimum = products.filter((product) => {
            if (typeof product.in_stock === 'number' &&
                typeof product.minimum_stock === 'number') {
                return product.in_stock < product.minimum_stock;
            }
            return false;
        }).length;
        const formattedProducts = products.map((product) => {
            const inStock = typeof product.in_stock === 'number' ? product.in_stock : 0;
            const minimumStock = typeof product.minimum_stock === 'number'
                ? product.minimum_stock
                : null;
            const belowMinimum = minimumStock !== null ? inStock < minimumStock : false;
            return {
                id: product.id,
                name: product.name,
                unit: product.unit,
                in_stock: inStock,
                minimum_stock: minimumStock,
                is_active: Boolean(product.is_active),
                category_id: product.category_id,
                category_name: product.category_name,
                below_minimum: belowMinimum,
            };
        });
        return res.status(200).json({
            filters: {
                name: typeof name === 'string' ? name : null,
                category_id: typeof category_id === 'string' && !isNaN(Number(category_id))
                    ? Number(category_id)
                    : null,
                is_active: typeof is_active === 'string'
                    ? ['true', 'false'].includes(is_active.toLowerCase())
                        ? is_active.toLowerCase() === 'true'
                        : null
                    : null,
            },
            summary: {
                total_products: totalProducts,
                total_in_stock: totalInStock,
                products_below_minimum: productsBelowMinimum,
            },
            products: formattedProducts,
        });
    }
    catch (error) {
        console.error('Erro ao gerar relatório de estoque:', error);
        const message = error instanceof Error
            ? error.message
            : 'Erro inesperado ao gerar relatório de estoque';
        return res
            .status(500)
            .json({ error: 'Erro ao gerar relatório de estoque', details: message });
    }
};
exports.getStockReport = getStockReport;
