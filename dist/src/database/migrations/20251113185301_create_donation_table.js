"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('donations', (table) => {
        table.increments('id').primary();
        table.enum('type', ['food', 'clothing', 'money', 'campaign']).notNullable();
        table.decimal('amount', 10, 2).nullable();
        table.integer('quantity').nullable();
        table.enum('unit', ['kg', 'g', 'l', 'ml', 'un']).nullable();
        table.string('observations').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(null);
        table
            .integer('donor_id')
            .unsigned()
            .references('id')
            .inTable('donors')
            .notNullable();
        table
            .integer('campaign_id')
            .unsigned()
            .references('id')
            .inTable('campaigns')
            .nullable();
        table
            .integer('collaborator_id')
            .unsigned()
            .references('id')
            .inTable('collaborators')
            .notNullable();
        table
            .integer('product_id')
            .unsigned()
            .references('id')
            .inTable('products')
            .nullable();
    });
}
async function down(knex) {
    return knex.schema.dropTableIfExists('donations');
}
