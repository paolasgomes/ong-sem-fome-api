import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createFoodBasket } from '../controllers/create';
import { updateFoodBasket } from '../controllers/update';
import { getAllFoodBaskets } from '../controllers/getAll';

const foodBasketsRoutes = Router();

foodBasketsRoutes.use(verifyToken);

foodBasketsRoutes.post('/', createFoodBasket);
foodBasketsRoutes.put('/:id', updateFoodBasket);
foodBasketsRoutes.get('/', getAllFoodBaskets);

export { foodBasketsRoutes };
