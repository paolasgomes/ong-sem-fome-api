import { db } from '@/database/connection';
import { Request, Response } from 'express';
import { createDonorSchema } from '../schemas/create';

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

const updateDonor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      type,
      name,
      email,
      phone,
      cpf,
      street_number,
      street_complement,
      street_neighborhood,
      city,
      state,
      zip_code,
      street_address,
      observation,
    } = req.body;

    const existingDonor = await db('donors')
      .where('cpf', cpf)
      .orWhere('email', email)
      .first();

    if (existingDonor) {
      return res.status(400).json({
        error: 'Já existe um doador com este CPF ou email',
      });
    }

    const validation = createDonorSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error,
      });
    }

    const updated = await db('donors').where({ id }).update({
      type,
      name,
      email,
      phone,
      cpf,
      street_number,
      street_complement,
      street_neighborhood,
      city,
      state,
      zip_code,
      street_address,
      observation,
      updated_at: db.fn.now(),
    });

    if (!updated) {
      return res.status(404).json({ error: 'Doador não encontrado' });
    }

    const donor = await db('donors').where({ id }).first();

    return res.json(donor);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar doador' });
  }
};

export { updateDonor };
