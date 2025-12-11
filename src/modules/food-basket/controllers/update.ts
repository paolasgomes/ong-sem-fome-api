import { Request, Response } from 'express';
import { createFoodBasketSchema } from '../schemas/createFoodBasketSchema';
import { db } from '../../../database/connection';
import { updateFoodBasketSchema } from '../schemas/updateFoodBasketSchema';

/**
 * @swagger
 * /food-baskets/:id:
 *   put:
 *     summary: Atualiza a cesta de alimentos
 *     tags: [FoodBaskets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 description: Lista de produtos e quantidades incluídos na cesta
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 10
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               description:
 *                 type: string
 *                 example: "Cesta padrão"
 *     responses:
 *       201:
 *         description: Cesta de alimentos criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */

const updateFoodBasket = async (req: Request, res: Response) => {
  try {
    const { id: basketId } = req.params;

    const validation = updateFoodBasketSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const existingBasket = await db('food_baskets')
      .where({ id: req.params.id })
      .first();

    if (!existingBasket) {
      return res
        .status(404)
        .json({ error: 'Cesta de alimentos não encontrada' });
    }

    const { products, ...data } = validation.data;

    await db
      .transaction(async (trx) => {
        await trx('food_baskets')
          .where({ id: basketId })
          .update({ ...data, updated_at: new Date().toISOString() });

        if (!products?.length || !products) return;

        await trx('food_baskets_items')
          .where({ food_basket_id: basketId })
          .del();

        await Promise.all(
          products.map(async (product) => {
            const existingProduct = await trx('products')
              .where({ id: product.product_id })
              .first();

            if (!existingProduct) {
              throw new Error(
                `Produto com ID ${product.product_id} não encontrado`,
              );
            }

            await trx('food_baskets_items').insert({
              food_basket_id: basketId,
              product_id: product.product_id,
              quantity: product.quantity,
            });
          }),
        );
      })
      .then(() =>
        res
          .status(201)
          .json({ message: 'Cesta de alimentos atualizada com sucesso' }),
      )
      .catch((error) => {
        return res.status(500).json({
          error: 'Erro ao atualizar cesta de alimentos',
          details: error?.message,
        });
      });
  } catch (error) {
    console.error('Erro ao atualizar cesta de alimentos:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar cesta de alimentos',
      details: error,
    });
  }
};

export { updateFoodBasket };
