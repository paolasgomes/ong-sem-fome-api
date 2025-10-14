import { Router } from 'express';
import { login } from '../controllers/auth';

const authRoutes = Router();

authRoutes.post('/', login);

export { authRoutes };
