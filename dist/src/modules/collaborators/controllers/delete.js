"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollaborator = void 0;
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /collaborators/{id}:
 *   delete:
 *     summary: Remove (soft delete) um colaborador pelo ID
 *     tags: [Collaborators]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do colaborador
 *     responses:
 *       200:
 *         description: Colaborador excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Colaborador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
const deleteCollaborator = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await (0, connection_1.db)('collaborators').where({ id }).del();
        if (!deleted) {
            return res.status(404).json({ error: 'Colaborador não encontrado' });
        }
        return res
            .status(204)
            .send({ message: 'Colaborador deletado com sucesso' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar colaborador' });
    }
};
exports.deleteCollaborator = deleteCollaborator;
