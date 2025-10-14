import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthPayload, ILoginRequest } from '../types';
import { authSchema } from '../schemas/auth';

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
      message: 'Autenticação realizada com sucesso',
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
