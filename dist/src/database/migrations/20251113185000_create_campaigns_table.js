"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('campaigns', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.timestamp('start_date').notNullable();
        table.timestamp('end_date').notNullable();
        table.string('description').nullable();
        table.integer('goal_quantity').nullable();
        table.decimal('goal_amount', 10, 2).nullable();
        table.boolean('is_active').defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(null);
    });
}
async function down(knex) {
    return knex.schema.dropTableIfExists('campaigns');
}
