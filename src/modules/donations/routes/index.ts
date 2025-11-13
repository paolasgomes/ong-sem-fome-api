import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createDonation } from '../controllers/create';

const donationsRoutes = Router();

donationsRoutes.use(verifyToken);

donationsRoutes.post('/', createDonation);

export { donationsRoutes };
