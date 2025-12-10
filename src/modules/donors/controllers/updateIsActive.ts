import { db } from '../../../database/connection';
import { updateIsActiveSchema } from '@/schemas/updateIsActive';
import { Request, Response } from 'express';

/**
 * @swagger
 * /donors/{id}/is-active:
 *   patch:
 *     summary: Atualiza o status ativo (is_active) de um doador
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
 *             properties:
 *               is_active:
 *                 type: boolean
 *             required:
 *               - is_active
 *     responses:
 *       201:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 type:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 cpf:
 *                   type: string
 *                 cnpj:
 *                   type: string
 *                 street_number:
 *                   type: string
 *                 street_complement:
 *                   type: string
 *                 street_neighborhood:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 zip_code:
 *                   type: string
 *                 street_address:
 *                   type: string
 *                 observation:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 *                 is_volunteer:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Doador não encontrado
 *       500:
 *         description: Erro ao atualizar doador
 */

const updateIsActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hasExistingDonor = await db('donors').where({ id }).first();

    if (!hasExistingDonor) {
      return res.status(404).json({
        error: 'Doador não encontrado',
      });
    }

    const validation = updateIsActiveSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const data = validation.data;

    await db('donors').where({ id }).update({
      is_active: data.is_active,
      updated_at: db.fn.now(),
    });

    const donor = await db('donors').where({ id }).first();

    const formattedDonor = {
      ...donor,
      is_active: donor.is_active === 1,
      is_volunteer: donor.is_volunteer === 1,
    };

    return res.status(201).json(formattedDonor);
  } catch (error) {
    console.log('error => ', error);
    return res.status(500).json({ error: 'Erro ao atualizar doador' });
  }
};

export { updateIsActive };
