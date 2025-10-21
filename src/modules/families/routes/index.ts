import { Router } from 'express';
import { createFamily } from '../controllers/create';
import { verifyToken } from '@/modules/auth/middlewares';
import { updateFamily } from '../controllers/update';
import { getFamilyById } from '../controllers/getById';

const familiesRoutes = Router();

familiesRoutes.use(verifyToken);

familiesRoutes.post('/', createFamily);
familiesRoutes.put('/:id', updateFamily);
familiesRoutes.get('/:id', getFamilyById);

export { familiesRoutes };
