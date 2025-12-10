"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.alterTable('food_basket_distributions', (table) => {
        table
            .enum('status', ['pending', 'delivered', 'canceled'])
            .defaultTo('pending');
    });
}
async function down(knex) {
    return knex.schema.alterTable('food_basket_distributions', (table) => {
        table.dropColumn('status');
    });
}
