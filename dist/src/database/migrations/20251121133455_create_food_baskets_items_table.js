"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('food_baskets_items', (table) => {
        table.increments('id').primary();
        table
            .integer('food_basket_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('food_baskets')
            .onDelete('CASCADE');
        table
            .integer('product_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('products')
            .onDelete('CASCADE');
        table.integer('quantity').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    return knex.schema.dropTable('food_baskets_items');
}
