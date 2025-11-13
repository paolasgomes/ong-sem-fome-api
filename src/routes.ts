import { Router } from 'express';
import { authRoutes } from './modules/auth/routes';
import { donorsRoutes } from './modules/donors/routes';
import { familiesRoutes } from './modules/families/routes/index';
import { collaboratorsRoutes } from './modules/collaborators/routes';
import { usersRoutes } from './modules/users/routes';
import { donationsRoutes } from './modules/donations/routes';
import { categoriesRoutes } from './modules/categories/routes';
import { productsRoutes } from './modules/products/routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/donors', donorsRoutes);
routes.use('/families', familiesRoutes);
routes.use('/collaborators', collaboratorsRoutes);
routes.use('/users', usersRoutes);
routes.use('/donations', donationsRoutes);
routes.use('/categories', categoriesRoutes);
routes.use('/products', productsRoutes);

export { routes };
