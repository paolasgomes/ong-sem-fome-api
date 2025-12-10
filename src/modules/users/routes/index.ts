import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createUser } from '../controllers/create';
import { updateUser } from '../controllers/update';
import { getAllUsers } from '../controllers/getAll';
import { getUserById } from '../controllers/getById';

const usersRoutes = Router();

usersRoutes.post('/', createUser);
usersRoutes.put('/:id', updateUser, verifyToken);
usersRoutes.get('/', getAllUsers, verifyToken);
usersRoutes.get('/:id', getUserById, verifyToken);

export { usersRoutes };
