"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.alterTable('donors', (table) => {
        table.string('cnpj').nullable().unique();
    });
}
async function down(knex) {
    return knex.schema.alterTable('donors', (table) => {
        table.dropColumn('cnpj');
    });
}
