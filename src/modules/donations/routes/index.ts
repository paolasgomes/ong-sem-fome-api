import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createDonation } from '../controllers/create';
import { getAllDonations } from '../controllers/getAll';

const donationsRoutes = Router();

donationsRoutes.use(verifyToken);

donationsRoutes.post('/', createDonation);
donationsRoutes.get('/', getAllDonations);

export { donationsRoutes };
