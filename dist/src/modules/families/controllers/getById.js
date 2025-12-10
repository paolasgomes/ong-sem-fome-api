"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFamilyById = void 0;
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /families/{id}:
 *   get:
 *     summary: Busca uma família pelo ID
 *     tags: [Families]
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
 *               $ref: '#/components/schemas/Family'
 *       404:
 *         description: Família não encontrada
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
const getFamilyById = async (req, res) => {
    try {
        const { id } = req.params;
        const family = await (0, connection_1.db)('families').where({ id }).first();
        if (!family) {
            return res.status(404).json({ error: 'Família não encontrada' });
        }
        const formattedFamily = {
            ...family,
            is_active: family.is_active === 1,
        };
        return res.json(formattedFamily);
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar família' });
    }
};
exports.getFamilyById = getFamilyById;
