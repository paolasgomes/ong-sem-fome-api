import { Request, Response } from 'express';
import { db } from '../../../database/connection';
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

const getAllDistributions = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const result = await db('food_basket_distributions')
      .select('*')
      .paginate({
        perPage: limit ? Number(limit) : 10,
        currentPage: page ? Number(page) : 1,
        isLengthAware: true,
      });

    const totalPages = result.pagination.lastPage || 1;

    const formattedData = result.data.map(async (distribution) => {
      let collaboratorData = await db('collaborators')
        .where({ id: distribution.collaborator_id })
        .first();

      if (!collaboratorData) {
        collaboratorData = null;
      }

      let familyData = await db('families')
        .where({ id: distribution.family_id })
        .first();

      if (!familyData) {
        familyData = null;
      }

      let campaignData = null;
      if (distribution.campaign_id) {
        campaignData = await db('campaigns')
          .where({ id: distribution.campaign_id })
          .first();
        if (!campaignData) {
          campaignData = null;
        }
      }

      let basketData = await db('food_baskets')
        .where({ id: distribution.food_basket_id })
        .first();

      const itemsBasketData = await db('food_baskets_items')
        .where({ food_basket_id: distribution.food_basket_id })
        .select('*');

      const formattedItemsBasketData = await Promise.all(
        itemsBasketData.map(async (item) => {
          const productData = await db('products')
            .where({ id: item.product_id })
            .first();

          if (productData) {
            return {
              name: productData.name,
              quantity: item.quantity,
            };
          }
        }),
      );

      if (!basketData) {
        basketData = null;
      }

      const {
        campaign_id,
        food_basket_id,
        collaborator_id,
        family_id,
        ...data
      } = distribution;

      const normalizedForeignData = {
        ...(campaignData && {
          campaign: {
            ...campaignData,
            id: campaignData?.id,
            name: campaignData?.name,
            is_active: Boolean(campaignData?.is_active),
          },
        }),
        food_basket: {
          id: basketData?.id,
          name: basketData?.name,
          description: basketData?.description,
          is_active: Boolean(basketData?.is_active),
          items: formattedItemsBasketData,
        },
        collaborator: {
          id: collaboratorData?.id,
          name: collaboratorData?.name,
          email: collaboratorData?.email,
          phone: collaboratorData?.phone,
          role: collaboratorData?.role,
          is_volunteer: Boolean(collaboratorData?.is_volunteer),
        },
        family: {
          id: familyData?.id,
          responsible_name: familyData?.responsible_name,
          responsible_cpf: familyData?.responsible_cpf,
          contact_phone: familyData?.contact_phone,
          city: familyData?.city,
          state: familyData?.state,
          is_active: Boolean(familyData?.is_active),
        },
      };

      return {
        ...data,
        ...normalizedForeignData,
      };
    });

    return res.json({
      results: await Promise.all(formattedData),
      page: result.pagination.currentPage,
      limit: result.pagination.perPage,
      total: result.pagination.total,
      totalPages,
    });
  } catch (error) {
    console.error('Erro ao criar distribuição da cesta de alimentos:', error);
    return res.status(500).json({
      error: 'Erro ao criar distribuição da cesta de alimentos',
      details: error,
    });
  }
};

export { getAllDistributions };
