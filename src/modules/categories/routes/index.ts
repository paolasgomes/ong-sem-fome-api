import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createCategory } from '../controllers/create';
import { getAllCategories } from '../controllers/getAll';

const categoriesRoutes = Router();

categoriesRoutes.use(verifyToken);

categoriesRoutes.post('/', createCategory);
categoriesRoutes.get('/', getAllCategories);

export { categoriesRoutes };
