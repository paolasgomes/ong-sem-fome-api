import knex from 'knex';
import { attachPaginate } from 'knex-paginate';
import config from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

export const db = knex(knexConfig);

attachPaginate();
