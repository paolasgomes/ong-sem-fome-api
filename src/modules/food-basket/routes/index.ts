import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createFoodBasket } from '../controllers/create';
import { updateFoodBasket } from '../controllers/update';
import { getAllFoodBaskets } from '../controllers/getAll';
import { getByIdFoodBaskets } from '../controllers/getById';

const foodBasketsRoutes = Router();

foodBasketsRoutes.use(verifyToken);

foodBasketsRoutes.post('/', createFoodBasket);
foodBasketsRoutes.put('/:id', updateFoodBasket);
foodBasketsRoutes.get('/', getAllFoodBaskets);
foodBasketsRoutes.get('/:id', getByIdFoodBaskets);

export { foodBasketsRoutes };
