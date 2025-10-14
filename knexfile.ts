import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/database.db',
    },
    pool: {
      afterCreate: (conn: any, cb: any) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      },
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
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/database.db',
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: (conn: any, cb: any) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      },
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
  },
};

export default config;
