"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDonor = void 0;
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /donors/{id}:
 *   delete:
 *     summary: Remove um doador pelo ID
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
 *       204:
 *         description: Doador removido com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Doador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
const deleteDonor = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await (0, connection_1.db)('donors').where({ id }).del();
        if (!deleted) {
            return res.status(404).json({ error: 'Doador não encontrado' });
        }
        return res.status(204).send({ message: 'Doador deletado com sucesso' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar doador' });
    }
};
exports.deleteDonor = deleteDonor;
