import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createFoodBasket } from '../controllers/create';
import { updateFoodBasket } from '../controllers/update';

const foodBasketsRoutes = Router();

foodBasketsRoutes.use(verifyToken);

foodBasketsRoutes.post('/', createFoodBasket);
foodBasketsRoutes.put('/:id', updateFoodBasket);

export { foodBasketsRoutes };
