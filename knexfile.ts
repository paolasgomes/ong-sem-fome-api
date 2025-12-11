import type { Knex } from 'knex';
import 'dotenv/config';

const common: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './src/database/database.db',
  },
  useNullAsDefault: true,
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
