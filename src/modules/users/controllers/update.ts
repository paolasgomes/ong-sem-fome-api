import { Request, Response } from 'express';
import { db } from '../../../database/connection';
import { createUserSchema } from '../schema/createUserSchema';
import { hashPassword } from '@/utils/hashPassword';

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ['admin', 'logistica', 'financeiro']
 *                 example: 'admin'
 *               name:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao.silva@example.com
 *               password:
 *                 type: string
 *                 example: "11999999999"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos ou duplicados
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */

const updateUser = async (req: Request, res: Response) => {
  try {
    const validation = createUserSchema.safeParse(req.body);

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

    const existingUserQuery = db('users')
      .where(function () {
        if (data.email) this.orWhere('email', data.email);
      })
      .andWhereNot('id', id)
      .first();

    const existingUser = await existingUserQuery;

    if (existingUser) {
      return res.status(400).json({
        error: 'Já existe um usuário com este email',
      });
    }

    await db('users')
      .where({ id })
      .update({
        name: data.name,
        email: data.email,
        role: data.role,
        updated_at: new Date().toISOString(),
        ...(data.password && { password: await hashPassword(data.password) }),
      });

    const updatedUser = await db('users').where({ id }).first();

    const { password: _, ...rest } = updatedUser;

    return res.status(200).json(rest);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro ao atualizar usuário', description: error });
  }
};

export { updateUser };
