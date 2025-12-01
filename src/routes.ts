import { Router } from 'express';
import { authRoutes } from './modules/auth/routes';
import { donorsRoutes } from './modules/donors/routes';
import { familiesRoutes } from './modules/families/routes/index';
import { collaboratorsRoutes } from './modules/collaborators/routes';
import { usersRoutes } from './modules/users/routes';
import { donationsRoutes } from './modules/donations/routes';
import { categoriesRoutes } from './modules/categories/routes';
import { productsRoutes } from './modules/products/routes';
import { stockRoutes } from './modules/stock/routes';
import { foodBasketsRoutes } from './modules/food-basket/routes';
import { foodDistributionsRoutes } from './modules/food-basket-distributions/routes';
import { campaignsRoutes } from './modules/campaigns/routes';
import { reportsRoutes } from './modules/reports/routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/donors', donorsRoutes);
routes.use('/families', familiesRoutes);
routes.use('/collaborators', collaboratorsRoutes);
routes.use('/users', usersRoutes);
routes.use('/donations', donationsRoutes);
routes.use('/categories', categoriesRoutes);
routes.use('/products', productsRoutes);
routes.use('/stock', stockRoutes);
routes.use('/food-baskets', foodBasketsRoutes);
routes.use('/food-distributions', foodDistributionsRoutes);
routes.use('/campaigns', campaignsRoutes);
routes.use('/reports', reportsRoutes);

export { routes };
