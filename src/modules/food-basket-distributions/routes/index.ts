import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createDistribution } from '../controllers/create';
import { getAllDistributions } from '../controllers/getAll';

const foodDistributionsRoutes = Router();

foodDistributionsRoutes.use(verifyToken);

foodDistributionsRoutes.post('/', createDistribution);
foodDistributionsRoutes.get('/', getAllDistributions);

export { foodDistributionsRoutes };
