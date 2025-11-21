import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createFoodBasket } from '../controllers/create';

const foodBasketsRoutes = Router();

foodBasketsRoutes.use(verifyToken);

foodBasketsRoutes.post('/', createFoodBasket);

export { foodBasketsRoutes };
