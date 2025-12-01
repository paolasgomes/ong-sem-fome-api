import { Router } from 'express';
import { createCampaign } from '../controllers/create';
import { updateCampaign } from '../controllers/update';
import { getAllCampaigns } from '../controllers/getAll';

const campaignsRoutes = Router();

campaignsRoutes.post('/', createCampaign);
campaignsRoutes.put('/:id', updateCampaign);
campaignsRoutes.get('/', getAllCampaigns);

export { campaignsRoutes };
