"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDonorById = void 0;
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
const getDonorById = async (req, res) => {
    try {
        const { id } = req.params;
        const donor = await (0, connection_1.db)('donors').where({ id }).first();
        if (!donor) {
            return res.status(404).json({ error: 'Doador não encontrado' });
        }
        const formattedDonor = {
            ...donor,
            is_active: donor.is_active === 1,
        };
        return res.json(formattedDonor);
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar doador' });
    }
};
exports.getDonorById = getDonorById;
