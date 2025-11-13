import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createProduct } from '../controllers/create';

const productsRoutes = Router();

productsRoutes.use(verifyToken);

productsRoutes.post('/', createProduct);

export { productsRoutes };
