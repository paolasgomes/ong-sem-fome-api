import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createUser } from '../controllers/create';
import { updateUser } from '../controllers/update';

const usersRoutes = Router();

usersRoutes.use(verifyToken);

usersRoutes.post('/', createUser);
usersRoutes.put('/:id', updateUser);

export { usersRoutes };
