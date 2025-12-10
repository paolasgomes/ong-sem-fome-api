"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.alterTable('products', (table) => {
        table.integer('in_stock').notNullable().defaultTo(0);
    });
}
async function down(knex) {
    return knex.schema.alterTable('products', (table) => {
        table.dropColumn('in_stock');
    });
}
