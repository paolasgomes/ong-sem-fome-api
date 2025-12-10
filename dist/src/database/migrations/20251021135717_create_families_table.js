"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('families', (table) => {
        table.increments('id').primary();
        table.string('responsible_name').notNullable();
        table.string('responsible_cpf').notNullable().unique();
        table.string('street_number').notNullable();
        table.string('street_complement');
        table.string('street_neighborhood').notNullable();
        table.string('city').notNullable();
        table.string('state').notNullable();
        table.string('zip_code').notNullable();
        table.string('street_address').notNullable();
        table.string('phone').notNullable();
        table.string('email').notNullable().unique();
        table.integer('members_count').notNullable();
        table.string('income_bracket').notNullable();
        table.string('address').notNullable();
        table.string('observation').nullable();
        table.boolean('is_active').defaultTo(true);
        table.boolean('has_social_programs').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(null);
        table
            .integer('social_program_id')
            .unsigned()
            .references('id')
            .inTable('social_programs')
            .nullable();
    });
}
async function down(knex) {
    return knex.schema.dropTableIfExists('families');
}
