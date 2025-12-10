"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('sectors', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(null);
    });
}
async function down(knex) {
    return knex.schema.dropTableIfExists('sectors');
}
