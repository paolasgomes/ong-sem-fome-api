"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const common = {
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
const config = {
    development: common,
    production: common,
};
exports.default = config;
