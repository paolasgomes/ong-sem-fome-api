import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createDistribution } from '../controllers/create';

const foodDistributionsRoutes = Router();

foodDistributionsRoutes.use(verifyToken);

foodDistributionsRoutes.post('/', createDistribution);

export { foodDistributionsRoutes };
