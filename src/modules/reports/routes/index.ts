import { Router } from 'express';
import { getCampaignsReport } from '../controllers/campaigns';
import { getDonationsReport } from '../controllers/donations';
import { verifyToken } from '@/modules/auth/middlewares';

const reportsRoutes = Router();

reportsRoutes.use(verifyToken);

reportsRoutes.get('/campaigns', getCampaignsReport);
reportsRoutes.get('/donations', getDonationsReport);

export { reportsRoutes };
