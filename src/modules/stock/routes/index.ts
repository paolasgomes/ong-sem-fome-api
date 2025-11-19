import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { updateStock } from '../controllers/update';

const stockRoutes = Router();

stockRoutes.use(verifyToken);

stockRoutes.patch('/:productId', updateStock);

export { stockRoutes };
