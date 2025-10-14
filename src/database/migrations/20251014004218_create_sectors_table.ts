import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sectors', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('sectors');
}
