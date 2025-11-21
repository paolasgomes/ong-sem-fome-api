import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createDistribution } from '../controllers/create';
import { getAllDistributions } from '../controllers/getAll';
import { updateStatus } from '../controllers/updateStatus';

const foodDistributionsRoutes = Router();

foodDistributionsRoutes.use(verifyToken);

foodDistributionsRoutes.post('/', createDistribution);
foodDistributionsRoutes.get('/', getAllDistributions);
foodDistributionsRoutes.patch('/status/:id', updateStatus);

export { foodDistributionsRoutes };
