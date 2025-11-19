import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('products', (table) => {
    table.integer('in_stock').notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('products', (table) => {
    table.dropColumn('in_stock');
  });
}
