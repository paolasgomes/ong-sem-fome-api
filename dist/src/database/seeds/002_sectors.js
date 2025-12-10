"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
async function seed(knex) {
    await knex('sectors').del();
    const now = knex.fn.now();
    await knex('sectors').insert([
        {
            name: 'Administração',
        },
        {
            name: 'Logística',
        },
        {
            name: 'Voluntariado',
        },
        {
            name: 'Financeiro',
        },
        {
            name: 'Comunicação',
        },
    ]);
}
