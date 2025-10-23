import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('donors', (table) => {
    table.string('cnpj').nullable().unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('donors', (table) => {
    table.dropColumn('cnpj');
  });
}
