import { Request, Response } from 'express';
import { db } from '../../../database/connection';
import { createCampaignSchema } from '../schemas/createCampaignSchema';

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Cria uma nova campanha
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - email
 *               - phone
 *               - cpf
 *               - street_number
 *               - street_neighborhood
 *               - city
 *               - state
 *               - zip_code
 *               - street_address
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [pessoa_fisica, pessoa_juridica]
 *                 example: pessoa_fisica
 *               name:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao.silva@example.com
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *               cpf:
 *                 type: string
 *                 example: "12345678901"
 *               street_number:
 *                 type: string
 *                 example: "123"
 *               street_complement:
 *                 type: string
 *                 example: "Apto 45"
 *               street_neighborhood:
 *                 type: string
 *                 example: "Centro"
 *               city:
 *                 type: string
 *                 example: "São Paulo"
 *               state:
 *                 type: string
 *                 example: "SP"
 *               zip_code:
 *                 type: string
 *                 example: "01000-000"
 *               street_address:
 *                 type: string
 *                 example: "Rua das Flores"
 *               observation:
 *                 type: string
 *                 example: "Entrega somente aos sábados"
 *     responses:
 *       201:
 *         description: Doador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Dados inválidos ou duplicados
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */

const createCampaign = async (req: Request, res: Response) => {
  try {
    const validation = createCampaignSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const { data } = validation;

    const existingCampaign = await db('campaigns')
      .where({ name: data.name })
      .andWhere({
        campaign_type: data.campaign_type,
        description: data.description,
      })
      .first();

    if (existingCampaign) {
      return res.status(400).json({
        error:
          'Já existe uma campanha com este nome, tipo e descrição. Indique o ano na descrição para campanhas recorrentes.',
      });
    }

    const [id] = await db('campaigns').insert(data);

    const campaign = await db('campaigns').where({ id }).first();

    const formattedCampaign = {
      ...campaign,
      is_active: campaign.is_active === 1,
    };

    return res.status(201).json(formattedCampaign);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro ao criar campanha', description: error });
  }
};

export { createCampaign };
