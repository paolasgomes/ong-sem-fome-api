import { Router } from 'express';
import { getAllDonors } from '../controllers/getAll';
import { createDonor } from '../controllers/create';

const donorsRoutes = Router();

donorsRoutes.get('/', getAllDonors);
donorsRoutes.post('/', createDonor);

export { donorsRoutes };
