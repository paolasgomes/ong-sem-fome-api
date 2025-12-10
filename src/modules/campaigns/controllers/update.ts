import { db } from '../../../database/connection';
import { Request, Response } from 'express';
import { updateCampaignSchema } from '../schemas/createCampaignSchema';

/**
 * @swagger
 * /donors/{id}:
 *   put:
 *     summary: Atualiza um doador pelo ID
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do doador
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               cpf:
 *                 type: string
 *               street_number:
 *                 type: string
 *               street_complement:
 *                 type: string
 *               street_neighborhood:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip_code:
 *                 type: string
 *               street_address:
 *                 type: string
 *               observation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doador atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Já existe um doador com este CPF ou email ou dados inválidos
 *       404:
 *         description: Doador não encontrado
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */

const updateCampaign = async (req: Request, res: Response) => {
  try {
    const validation = updateCampaignSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }
    const { data } = validation;

    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

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

    const updated = await db('campaigns')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
        is_active: Boolean(data.is_active),
      });

    if (!updated) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    const campaign = await db('campaigns').where({ id }).first();

    const formattedCampaign = {
      ...campaign,
      is_active: campaign.is_active === 1,
    };

    return res.json(formattedCampaign);
  } catch (error: any) {
    console.error('Erro ao atualizar campanha:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao atualizar campanha', details: error?.message });
  }
};

export { updateCampaign };
