import { Router } from 'express';
import { authRoutes } from './modules/auth/routes';
import { donorsRoutes } from './modules/donors/routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/donors', donorsRoutes);

export { routes };
