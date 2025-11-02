import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('donors', (table) => {
    table.boolean('is_active').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('donors', (table) => {
    table.dropColumn('is_active');
  });
}
