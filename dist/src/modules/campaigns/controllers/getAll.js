"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCampaigns = void 0;
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /donors:
 *   get:
 *     summary: Lista todos os doadores com paginação
 *     tags: [Donors]
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
const getAllCampaigns = async (req, res) => {
    try {
        const { page, limit, name, created_from, created_to, campaign_type } = req.query;
        const query = (0, connection_1.db)('campaigns').select('*');
        if (name) {
            query.whereILike('name', `%${name}%`);
        }
        if (created_from) {
            query.where('start_date', '>=', created_from);
        }
        if (created_to) {
            query.where('start_date', '<=', created_to);
        }
        if (campaign_type) {
            query.where('campaign_type', campaign_type);
        }
        const result = await query.paginate({
            perPage: limit ? Number(limit) : 10,
            currentPage: page ? Number(page) : 1,
            isLengthAware: true,
        });
        const totalPages = result.pagination.lastPage || 1;
        const formattedData = result.data.map((campaign) => ({
            ...campaign,
            is_active: campaign.is_active === 1,
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
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar campanhas' });
    }
};
exports.getAllCampaigns = getAllCampaigns;
