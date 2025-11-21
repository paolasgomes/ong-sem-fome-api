import { Request, Response } from 'express';
import { updateStatusSchema } from '../schemas/updateStatus';
import { db } from '@/database/connection';

/**
 * @swagger
 * /food-basket-distributions/status/{id}:
 *   patch:
 *     summary: Atualiza o status de uma distribuição de cesta de alimentos
 *     tags:
 *       - FoodBasketDistributions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da distribuição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, delivered, canceled]
 *                 description: Novo status da distribuição
 *                 example: delivered
 *     responses:
 *       '200':
 *         description: Status da distribuição atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Dados inválidos
 *       '404':
 *         description: Distribuição não encontrada
 *       '500':
 *         description: Erro interno do servidor
 */

const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id: distributionId } = req.params;

    const validation = updateStatusSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const { status } = validation.data;

    await db('food_basket_distributions')
      .where({ id: distributionId })
      .update({ status, updated_at: db.fn.now() });

    return res.status(200).json({
      message: 'Status da distribuição atualizado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar status da distribuição:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar status da distribuição',
      details: error,
    });
  }
};

export { updateStatus };
