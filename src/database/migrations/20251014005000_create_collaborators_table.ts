import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('collaborators', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('registration').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('phone').notNullable();
    table.timestamp('admission_date').defaultTo(knex.fn.now());
    table.timestamp('dismissal_date').defaultTo(null);
    table.boolean('is_volunteer').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(null);

    table
      .integer('sector_id')
      .unsigned()
      .references('id')
      .inTable('sectors')
      .onDelete('SET NULL');

    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('collaborators');
}
