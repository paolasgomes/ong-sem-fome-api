import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('food_basket_distributions', (table) => {
    table.increments('id').primary();
    table
      .integer('food_basket_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('food_baskets')
      .onDelete('CASCADE');
    table
      .integer('collaborator_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('collaborators')
      .onDelete('CASCADE');
    table
      .integer('campaign_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('campaigns')
      .onDelete('CASCADE');
    table
      .integer('family_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('families')
      .onDelete('CASCADE');

    table.text('observations').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(null);
    table.timestamp('delivery_date').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('food_basket_distributions');
}
