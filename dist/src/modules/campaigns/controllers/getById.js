"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampaignById = void 0;
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /donors/{id}:
 *   get:
 *     summary: Busca um doador pelo ID
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do doador
 *     responses:
 *       200:
 *         description: Doador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       404:
 *         description: Doador não encontrado
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await (0, connection_1.db)('campaigns').where({ id }).first();
        if (!campaign) {
            return res.status(404).json({ error: 'Campanha não encontrada' });
        }
        const formattedCampaign = {
            ...campaign,
            is_active: campaign.is_active === 1,
        };
        return res.json(formattedCampaign);
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar campanha' });
    }
};
exports.getCampaignById = getCampaignById;
