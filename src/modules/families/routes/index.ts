import { Router } from 'express';
import { createFamily } from '../controllers/create';
import { verifyToken } from '@/modules/auth/middlewares';
import { updateFamily } from '../controllers/update';
import { getFamilyById } from '../controllers/getById';
import { getAllFamilies } from '../controllers/getAll';
import { deleteFamily } from '../controllers/delete';

const familiesRoutes = Router();

familiesRoutes.use(verifyToken);

familiesRoutes.post('/', createFamily);
familiesRoutes.put('/:id', updateFamily);
familiesRoutes.get('/:id', getFamilyById);
familiesRoutes.get('/', getAllFamilies);
familiesRoutes.delete('/:id', deleteFamily);

export { familiesRoutes };
