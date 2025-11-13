import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createProduct } from '../controllers/create';
import { getAllProducts } from '../controllers/getAll';

const productsRoutes = Router();

productsRoutes.use(verifyToken);

productsRoutes.post('/', createProduct);
productsRoutes.get('/', getAllProducts);

export { productsRoutes };
