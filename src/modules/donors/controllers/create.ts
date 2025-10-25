import { Request, Response } from 'express';
import { db } from '../../../database/connection';
import { createDonorSchema } from '../schemas/create';

/**
 * @swagger
 * /donors:
 *   post:
 *     summary: Cria um novo doador
 *     tags: [Donors]
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

const createDonor = async (req: Request, res: Response) => {
  try {
    const validation = createDonorSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const {
      type,
      name,
      email,
      phone,
      cpf,
      cnpj,
      street_number,
      street_complement,
      street_neighborhood,
      city,
      state,
      zip_code,
      street_address,
      observation,
    } = validation.data;

    const existingDonor = await db('donors')
      .where('cpf', cpf)
      .orWhere('email', email)
      .first();

    if (existingDonor) {
      return res.status(400).json({
        error: 'Já existe um doador com este CPF ou email',
      });
    }

    const [id] = await db('donors').insert({
      type,
      name,
      email,
      phone,
      cpf,
      cnpj,
      street_number,
      street_complement,
      street_neighborhood,
      city,
      state,
      zip_code,
      street_address,
      observation,
      updated_at: new Date().toISOString(),
    });

    const donor = await db('donors').where({ id }).first();
    return res.status(201).json(donor);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar doador' });
  }
};

export { createDonor };
