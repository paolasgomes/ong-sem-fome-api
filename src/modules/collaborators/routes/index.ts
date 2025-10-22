import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createCollaborator } from '../controllers/create';
import { updateCollaborator } from '../controllers/update';

const collaboratorsRoutes = Router();

collaboratorsRoutes.use(verifyToken);

collaboratorsRoutes.post('/', createCollaborator);

collaboratorsRoutes.put('/:id', updateCollaborator);

export { collaboratorsRoutes };
