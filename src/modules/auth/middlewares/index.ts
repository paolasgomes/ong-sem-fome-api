import { Request, Response } from 'express';
import { IAuthPayload } from '../types';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response): Response => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido',
      });
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as IAuthPayload;

    return res.status(200).json({
      message: 'Token válido',
      user: decoded,
    });
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido ou expirado',
    });
  }
};

export { verifyToken };
