"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const hashPassword_1 = require("@/utils/hashPassword");
async function seed(knex) {
    await knex('users').del();
    await knex('users').insert([
        {
            name: 'Admin User',
            email: 'admin@ongsemfome2.com',
            password: await (0, hashPassword_1.hashPassword)('admin123'),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ]);
}
