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
    const validation = createDonorSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }
    const data = validation.data;

    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { cpf, email, cnpj } = data;

    const existingDonorQuery = db('donors')
      .where(function () {
        if (cpf) this.orWhere('cpf', cpf);
        if (email) this.orWhere('email', email);
        if (cnpj) this.orWhere('cnpj', cnpj);
      })
      .andWhereNot('id', id)
      .first();

    const existingDonor = await existingDonorQuery;

    if (existingDonor) {
      return res.status(400).json({
        error: 'Já existe um doador com este CPF, CNPJ ou email',
      });
    }

    const updated = await db('donors').where({ id }).update({
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      cnpj: data.cnpj,
      street_number: data.street_number,
      street_complement: data.street_complement,
      street_neighborhood: data.street_neighborhood,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      street_address: data.street_address,
      observation: data.observation,
      is_active: data.is_active,
      updated_at: db.fn.now(),
    });

    if (!updated) {
      return res.status(404).json({ error: 'Doador não encontrado' });
    }

    const donor = await db('donors').where({ id }).first();

    const formattedDonor = {
      ...donor,
      is_active: donor.is_active === 1,
    };

    return res.json(formattedDonor);
  } catch (error: any) {
    console.error('Erro ao atualizar doador:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao atualizar doador', details: error?.message });
  }
};

export { updateDonor };
