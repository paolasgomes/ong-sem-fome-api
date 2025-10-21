import { Router } from 'express';
import { createFamily } from '../controllers/create';

const familiesRoutes = Router();

familiesRoutes.post('/', createFamily);

export { familiesRoutes };
