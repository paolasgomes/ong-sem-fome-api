"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('donors', (table) => {
        table.string('cpf', 14).nullable().alter();
        // sem ADD UNIQUE aqui
    });
}
async function down(knex) {
    // se quiser, só volta o tipo
    await knex.schema.alterTable('donors', (table) => {
        table.string('cpf', 14).notNullable().alter();
    });
}
