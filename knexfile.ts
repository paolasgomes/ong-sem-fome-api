import type { Knex } from 'knex';
import 'dotenv/config';

const common: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
  seeds: {
    extension: 'ts',
    directory: './src/database/seeds',
  },
};

const config: { [key: string]: Knex.Config } = {
  development: common,
  production: common,
};

export default config;
