import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '@/database/connection';
import { authSchema } from '../schemas/auth';

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Autentica o usuário e gera um token JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@ongsemfome2.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Email e/ou senha incorretos
 *       404:
 *         description: Email e/ou senha incorretos
 *       500:
 *         description: Erro interno do servidor
 */

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const validation = authSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: 'Dados inválidos.',
      details: validation.error._zod,
    });
  }

  try {
    const user = await db('users').select('*').where({ email }).first();

    if (!user) {
      return res.status(404).json({ error: 'Email e/ou senha incorretos' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email e/ou senha incorretos' });
    }

    const token = jwt.sign({ userId: user.id }, 'secret-key', {
      expiresIn: '1h',
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export { login };
