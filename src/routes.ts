import { Router } from 'express';
import { authRoutes } from './modules/auth/routes';
import { donorsRoutes } from './modules/donors/routes';
import { familiesRoutes } from './modules/families/routes/index';
import { collaboratorsRoutes } from './modules/collaborators/routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/donors', donorsRoutes);
routes.use('/families', familiesRoutes);
routes.use('/collaborators', collaboratorsRoutes);

export { routes };
