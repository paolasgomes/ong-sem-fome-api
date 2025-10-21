import { db } from '@/database/connection';
import { Request, Response } from 'express';

/**
 * @swagger
 * /donors/{id}:
 *   delete:
 *     summary: Remove um doador pelo ID
 *     tags: [Donors]
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
 *       404:
 *         description: Doador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

const deleteDonor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await db('donors').where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ error: 'Doador não encontrado' });
    }

    return res.status(204).send({ message: 'Doador deletado com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar doador' });
  }
};

export { deleteDonor };
