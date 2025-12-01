import { Router } from 'express';
import { getCampaignsReport } from '../controllers/campaigns';

const reportsRoutes = Router();

reportsRoutes.get('/campaigns', getCampaignsReport);

export { reportsRoutes };
