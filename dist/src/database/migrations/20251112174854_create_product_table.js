"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('products', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('unit').notNullable().defaultTo('quilogramas');
        table.integer('minimum_stock').notNullable().defaultTo(0);
        table.boolean('is_active').notNullable().defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(null);
        table
            .integer('category_id')
            .unsigned()
            .references('id')
            .inTable('categories')
            .nullable();
    });
}
async function down(knex) {
    return knex.schema.dropTableIfExists('products');
}
