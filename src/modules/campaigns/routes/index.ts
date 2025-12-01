import { Router } from 'express';
import { createCampaign } from '../controllers/create';
import { updateCampaign } from '../controllers/update';
import { getAllCampaigns } from '../controllers/getAll';
import { getCampaignById } from '../controllers/getById';

const campaignsRoutes = Router();

campaignsRoutes.post('/', createCampaign);
campaignsRoutes.put('/:id', updateCampaign);
campaignsRoutes.get('/', getAllCampaigns);
campaignsRoutes.get('/:id', getCampaignById);

export { campaignsRoutes };
