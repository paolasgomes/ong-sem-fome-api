import { Router } from 'express';
import { createCampaign } from '../controllers/create';
import { updateCampaign } from '../controllers/update';

const campaignsRoutes = Router();

campaignsRoutes.post('/', createCampaign);
campaignsRoutes.put('/:id', updateCampaign);

export { campaignsRoutes };
