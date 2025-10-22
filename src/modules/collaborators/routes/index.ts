import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createCollaborator } from '../controllers/create';

const collaboratorsRoutes = Router();

collaboratorsRoutes.use(verifyToken);

collaboratorsRoutes.post('/', createCollaborator);

export { collaboratorsRoutes };
