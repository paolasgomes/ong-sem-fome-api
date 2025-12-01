import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('campaigns', (table) => {
    table.string('campaign_type').notNullable().defaultTo('general');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('campaigns', (table) => {
    table.dropColumn('campaign_type');
  });
}
