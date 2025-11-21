import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('food_basket_distributions', (table) => {
    table
      .enum('status', ['pending', 'delivered', 'canceled'])
      .defaultTo('pending');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('food_basket_distributions', (table) => {
    table.dropColumn('status');
  });
}
