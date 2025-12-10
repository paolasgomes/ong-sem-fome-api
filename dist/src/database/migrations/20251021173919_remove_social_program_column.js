"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.alterTable('families', (table) => {
        table.dropColumn('social_program_id');
        table.dropColumn('has_social_programs');
    });
}
async function down(knex) {
    return knex.schema.alterTable('families', (table) => {
        table.boolean('has_social_programs').defaultTo(false);
        table
            .integer('social_program_id')
            .unsigned()
            .references('id')
            .inTable('social_programs')
            .nullable();
    });
}
