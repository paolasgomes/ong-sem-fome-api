import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createCategory } from '../controllers/create';

const categoriesRoutes = Router();

categoriesRoutes.use(verifyToken);

categoriesRoutes.post('/', createCategory);

export { categoriesRoutes };
