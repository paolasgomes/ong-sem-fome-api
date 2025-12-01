import { Router } from 'express';
import { getCampaignsReport } from '../controllers/campaigns';
import { getDonationsReport } from '../controllers/donations';
import { verifyToken } from '@/modules/auth/middlewares';
import { getStockReport } from '../controllers/stock';
import { getCollaboratorsReport } from '../controllers/collaborators';

const reportsRoutes = Router();

reportsRoutes.use(verifyToken);

reportsRoutes.get('/campaigns', getCampaignsReport);
reportsRoutes.get('/donations', getDonationsReport);
reportsRoutes.get('/stock', getStockReport);
reportsRoutes.get('/collaborators', getCollaboratorsReport);

export { reportsRoutes };
