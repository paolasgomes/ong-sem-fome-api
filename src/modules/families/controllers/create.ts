import { Request, Response } from 'express';
import { db } from '../../../database/connection';
import { createFamilySchema } from '../schemas/create';

/**
 * @swagger
 * /families:
 *   post:
 *     summary: Cria uma nova família
 *     tags: [Families]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - responsible_name
 *               - responsible_cpf
 *               - street_number
 *               - street_neighborhood
 *               - city
 *               - state
 *               - zip_code
 *               - street_address
 *               - phone
 *               - email
 *               - members_count
 *               - income_bracket
 *               - address
 *             properties:
 *               responsible_name:
 *                 type: string
 *                 example: Maria Oliveira
 *               responsible_cpf:
 *                 type: string
 *                 example: "12345678901"
 *               street_number:
 *                 type: string
 *                 example: "100"
 *               street_complement:
 *                 type: string
 *                 example: "Casa 2"
 *               street_neighborhood:
 *                 type: string
 *                 example: "Jardim das Flores"
 *               city:
 *                 type: string
 *                 example: "São Paulo"
 *               state:
 *                 type: string
 *                 example: "SP"
 *               zip_code:
 *                 type: string
 *                 example: "01234-567"
 *               street_address:
 *                 type: string
 *                 example: "Rua das Acácias"
 *               phone:
 *                 type: string
 *                 example: "11988887777"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria.oliveira@example.com"
 *               members_count:
 *                 type: integer
 *                 example: 4
 *               income_bracket:
 *                 type: string
 *                 example: "Até 2 salários mínimos"
 *               address:
 *                 type: string
 *                 example: "Rua das Acácias, 100, Jardim das Flores"
 *               observation:
 *                 type: string
 *                 example: "Família cadastrada pelo projeto social"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Família criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 responsible_name:
 *                   type: string
 *                 responsible_cpf:
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
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *                 members_count:
 *                   type: integer
 *                 income_bracket:
 *                   type: string
 *                 address:
 *                   type: string
 *                 observation:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 *       400:
 *         description: Dados inválidos ou família já existente
 *       500:
 *         description: Erro interno do servidor
 */

const createFamily = async (req: Request, res: Response) => {
  try {
    const validation = createFamilySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const data = validation.data;

    const existingFamily = await db('families')
      .where('responsible_cpf', data.responsible_cpf)
      .orWhere('email', data.email)
      .first();

    if (existingFamily) {
      return res.status(400).json({
        error: 'Já existe uma família com este CPF ou email',
      });
    }

    const [id] = await db('families').insert({
      responsible_name: data.responsible_name,
      responsible_cpf: data.responsible_cpf,
      street_number: data.street_number,
      street_complement: data.street_complement,
      street_neighborhood: data.street_neighborhood,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      street_address: data.street_address,
      phone: data.phone,
      email: data.email,
      members_count: data.members_count,
      income_bracket: data.income_bracket,
      address: data.address,
      observation: data.observation,
      is_active: data.is_active,
    });

    const family = await db('families').where({ id }).first();
    return res.status(201).json(family);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar família' });
  }
};
export { createFamily };
