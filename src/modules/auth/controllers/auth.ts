import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthPayload, ILoginRequest } from '../types';
import { authSchema } from '../schemas/auth';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and generate JWT token
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
 *                 example: admin@ongsemfome.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Authentication successful
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
 *                     email:
 *                       type: string
 *                       example: admin@ongsemfome.com
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Internal server error
 */
const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: ILoginRequest = req.body;

    const validationResult = authSchema.safeParse({ email, password });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validationResult.error,
      });
    }

    const payload: IAuthPayload = {
      userId: 'user-id',
      email,
    };

    const secret = process.env.JWT_SECRET || 'token';

    const token = jwt.sign(payload, secret, {
      expiresIn: '24h',
    });

    return res.status(200).json({
      token,
      user: {
        email: payload.email,
      },
    });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
    });
  }
};

export { login };
