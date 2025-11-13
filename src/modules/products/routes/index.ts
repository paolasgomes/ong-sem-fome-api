import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createProduct } from '../controllers';

const productsRoutes = Router();

productsRoutes.use(verifyToken);

productsRoutes.post('/', createProduct);

export { productsRoutes };
