import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('families', (table) => {
    table.dropColumn('social_program_id');
    table.dropColumn('has_social_programs');
  });
}

export async function down(knex: Knex): Promise<void> {
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
