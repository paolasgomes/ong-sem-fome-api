import { Router } from 'express';
import { createFamily } from '../controllers/create';
import { verifyToken } from '@/modules/auth/middlewares';

const familiesRoutes = Router();

familiesRoutes.use(verifyToken);

familiesRoutes.get('/', createFamily);
// familiesRoutes.post('/', createDonor);
// familiesRoutes.get('/:id', getDonorById);
// familiesRoutes.put('/:id', updateDonor);
// familiesRoutes.delete('/:id', deleteDonor);

export { familiesRoutes };
