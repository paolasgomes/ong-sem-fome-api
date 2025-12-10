import { db } from '../../../database/connection';
import { Request, Response } from 'express';

/**
 * @swagger
 * /families/{id}:
 *   delete:
 *     summary: Remove uma família pelo ID
 *     tags: [Families]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da família
 *     responses:
 *       204:
 *         description: Família removida com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Família não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

const deleteFamily = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await db('families').where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ error: 'Família não encontrada' });
    }

    return res.status(204).send({ message: 'Família deletada com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar família' });
  }
};

export { deleteFamily };
