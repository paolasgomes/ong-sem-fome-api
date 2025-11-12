import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createUser } from '../controllers/create';

const usersRoutes = Router();

usersRoutes.use(verifyToken);

usersRoutes.post('/', createUser);

export { usersRoutes };
