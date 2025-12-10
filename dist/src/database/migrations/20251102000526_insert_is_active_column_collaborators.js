"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('collaborators', (table) => {
        table.boolean('is_active').notNullable().defaultTo(false);
    });
}
async function down(knex) {
    await knex.schema.alterTable('collaborators', (table) => {
        table.dropColumn('is_active');
    });
}
