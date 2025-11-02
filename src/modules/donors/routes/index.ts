import { Router } from 'express';
import { getAllDonors } from '../controllers/getAll';
import { createDonor } from '../controllers/create';
import { getDonorById } from '../controllers/getById';
import { updateDonor } from '../controllers/update';
import { deleteDonor } from '../controllers/delete';
import { verifyToken } from '@/modules/auth/middlewares';
import { updateIsActive } from '../controllers/updateIsActive';

const donorsRoutes = Router();

donorsRoutes.use(verifyToken);

donorsRoutes.get('/', getAllDonors);
donorsRoutes.post('/', createDonor);
donorsRoutes.get('/:id', getDonorById);
donorsRoutes.put('/:id', updateDonor);
donorsRoutes.delete('/:id', deleteDonor);
donorsRoutes.patch('/:id/is-active', updateIsActive);

export { donorsRoutes };
