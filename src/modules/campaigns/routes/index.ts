import { Router } from 'express';
import { createCampaign } from '../controllers/create';

const campaignsRoutes = Router();

campaignsRoutes.post('/', createCampaign);

export { campaignsRoutes };
