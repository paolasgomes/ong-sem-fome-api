import { Request, Response } from 'express';
import { db } from '@/database/connection';

/**
 * @swagger
 * /food-baskets:
 *   get:
 *     summary: Registra a distribuição de uma cesta de alimentos
 *     tags: [FoodBasketDistributions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - food_basket_id
 *             properties:
 *               food_basket_id:
 *                 type: integer
 *                 description: ID da cesta que será distribuída (itens definidos na cesta)
 *                 example: 1
 *               campaign_id:
 *                 type: integer
 *                 description: ID da campanha associada à distribuição (opcional)
 *                 example: 3
 *               collaborator_id:
 *                 type: integers
 *                 description: ID do colaborador que realizou a distribuição (opcional)
 *                 example: 2
 *               family_id:
 *                 type: integer
 *                 description: ID da família que recebeu a distribuição (opcional)
 *                 example: 5
 *               delivery_date:
 *                 type: string
 *                 format: date-time
 *                 description: Data/hora da distribuição (opcional)
 *                 example: "2025-11-21T14:30:00Z"
 *               observations:
 *                 type: string
 *                 description: Observações sobre a distribuição
 *                 example: "Entregue com conferência de documentos"
 *     responses:
 *       201:
 *         description: Distribuição registrada com sucesso
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
 *       404:
 *         description: Cesta ou produto não encontrado / Estoque insuficiente
 *       500:
 *         description: Erro interno do servidor
 */

const getByIdFoodBaskets = async (req: Request, res: Response) => {
  try {
    const { id: basketId } = req.params;

    const basket = await db('food_baskets').where({ id: basketId }).first();

    if (!basket) {
      return res.status(404).json({
        error: 'Cesta de alimentos não encontrada',
      });
    }

    const basketItems = await db('food_baskets_items')
      .where({ food_basket_id: basketId })
      .select('product_id', 'quantity');

    if (!basketItems.length) {
      return res.json({ ...basket, items: [] });
    }

    const detailedItems = await Promise.all(
      basketItems.map(async (item) => {
        const product = await db('products')
          .where({ id: item.product_id })
          .first();

        return {
          name: product?.name,
          quantity: item.quantity,
        };
      }),
    );

    return res.json({
      ...basket,
      is_active: Boolean(basket.is_active),
      items: detailedItems,
    });
  } catch (error) {
    console.error('Erro ao obter cesta de alimentos:', error);
    return res.status(500).json({
      error: 'Erro ao obter cesta de alimentos',
      details: error,
    });
  }
};

export { getByIdFoodBaskets };
