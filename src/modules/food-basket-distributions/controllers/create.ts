import { Request, Response } from 'express';
import { db } from '@/database/connection';
import { createDistributionSchema } from '../schemas/createDistributionSchema';

/**
 * @swagger
 * /food-basket-distributions:
 *   post:
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
 *               status:
 *                 type: string
 *                 enum: [pending, delivered, canceled]
 *                 description: Status da distribuição
 *                 example: "pending"
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

const createDistribution = async (req: Request, res: Response) => {
  try {
    const validation = createDistributionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const data = validation.data;

    const basket = await db('food_baskets')
      .where({ id: data.food_basket_id })
      .first();
    if (!basket)
      return res
        .status(404)
        .json({ error: 'Cesta de alimentos não encontrada' });

    const collaborator = await db('collaborators')
      .where({ id: data.collaborator_id })
      .first();
    if (!collaborator)
      return res.status(404).json({ error: 'Colaborador não encontrado' });

    if (data.family_id) {
      const family = await db('families').where({ id: data.family_id }).first();
      if (!family)
        return res.status(404).json({ error: 'Família não encontrada' });
    }

    if ((data as any).campaign_id) {
      const campaign = await db('campaigns')
        .where({ id: (data as any).campaign_id })
        .first();
      if (!campaign)
        return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    await db
      .transaction(async (trx) => {
        const [id] = await trx('food_basket_distributions').insert(data);

        const basketItems = await trx('food_baskets_items')
          .where({ food_basket_id: data.food_basket_id })
          .select('product_id', 'quantity');

        await Promise.all(
          basketItems.map(async (item) => {
            const product = await trx('products')
              .where({ id: item.product_id })
              .first();

            if (product) {
              const updatedStock = (product.in_stock || 0) - item.quantity;

              if (updatedStock < 0) {
                throw new Error(
                  `Estoque insuficiente para o produto ID ${item.product_id}`,
                );
              }

              await trx('products')
                .where({ id: item.product_id })
                .update({ in_stock: updatedStock, updated_at: trx.fn.now() });
            } else {
              throw new Error(
                `Produto com ID ${item.product_id} não encontrado`,
              );
            }
          }),
        );
      })
      .then(() =>
        res
          .status(201)
          .json({ message: 'Distribuição registrada com sucesso' }),
      )
      .catch((error) => {
        return res.status(500).json({
          error: 'Erro ao criar distribuição da cesta de alimentos',
          details: error?.message,
        });
      });
  } catch (error) {
    console.error('Erro ao criar distribuição da cesta de alimentos:', error);
    return res.status(500).json({
      error: 'Erro ao criar distribuição da cesta de alimentos',
      details: error,
    });
  }
};

export { createDistribution };
