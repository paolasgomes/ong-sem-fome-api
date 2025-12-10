"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
async function seed(knex) {
    await knex('donors').del();
    await knex('donors').insert([
        {
            type: 'pessoa_fisica',
            name: 'João da Silva',
            email: 'joao.silva003@example.com',
            phone: '1199999999',
            cpf: '12345789601',
            street_number: '123',
            street_complement: 'Apto 45',
            street_neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zip_code: '01000-000',
            street_address: 'Rua das Flores',
            observation: 'Entrega somente aos sábados',
        },
    ]);
}
