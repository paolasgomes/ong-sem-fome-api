import { verifyToken } from '@/modules/auth/middlewares';
import { Router } from 'express';
import { createCollaborator } from '../controllers/create';
import { updateCollaborator } from '../controllers/update';
import { getAllCollaborators } from '../controllers/getAll';
import { getCollaboratorById } from '../controllers/getById';
import { deleteCollaborator } from '../controllers/delete';

const collaboratorsRoutes = Router();

collaboratorsRoutes.use(verifyToken);

collaboratorsRoutes.post('/', createCollaborator);

collaboratorsRoutes.put('/:id', updateCollaborator);

collaboratorsRoutes.get('/', getAllCollaborators);

collaboratorsRoutes.get('/:id', getCollaboratorById);

collaboratorsRoutes.delete('/:id', deleteCollaborator);

export { collaboratorsRoutes };
