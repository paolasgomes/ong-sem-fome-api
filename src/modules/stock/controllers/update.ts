import { db } from '@/database/connection';
import { Request, Response } from 'express';
import { updateStockSchema } from '../schemas/updateStockSchema';

/**
 * @swagger
 * /stock/{productId}:
 *   patch:
 *     summary: Atualiza o estoque de um produto (incrementa ou decrementa)
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Quantidade a ajustar (positivo para entrada, negativo para saída)
 *                 example: 5
 *     responses:
 *       200:
 *         description: Estoque atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     in_stock:
 *                       type: integer
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

const updateStock = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const validation = updateStockSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const { quantity } = validation.data;

    const product = await db('products').where({ id: productId }).first();

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const updatedStock = (product.in_stock || 0) + quantity;

    await db('products')
      .where({ id: productId })
      .update({ in_stock: updatedStock, updated_at: db.fn.now() });

    return res.status(200).json({
      message: 'Estoque atualizado com sucesso',
      product: {
        ...product,
        in_stock: updatedStock,
      },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar estoque', error);
    return res
      .status(500)
      .json({ error: 'Erro ao atualizar estoque', details: error?.message });
  }
};

export { updateStock };
