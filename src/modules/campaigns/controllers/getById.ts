import { db } from '../../../database/connection';
import { Request, Response } from 'express';

/**
 * @swagger
 * /donors/{id}:
 *   get:
 *     summary: Busca um doador pelo ID
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
 *     responses:
 *       200:
 *         description: Doador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       404:
 *         description: Doador não encontrado
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */

const getCampaignById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const campaign = await db('campaigns').where({ id }).first();

    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    return res.json(campaign);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar campanha' });
  }
};

export { getCampaignById };
