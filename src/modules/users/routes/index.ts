import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createUser } from '../controllers/create';
import { updateUser } from '../controllers/update';
import { getAllUsers } from '../controllers/getAll';
import { getUserById } from '../controllers/getById';

const usersRoutes = Router();

usersRoutes.use(verifyToken);

usersRoutes.post('/', createUser);
usersRoutes.put('/:id', updateUser);
usersRoutes.get('/', getAllUsers);
usersRoutes.get('/:id', getUserById);

export { usersRoutes };
