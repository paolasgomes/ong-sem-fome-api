import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('donors', (table) => {
    table.increments('id').primary();
    table.enum('type', ['pessoa_fisica', 'pessoa_juridica']).notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').notNullable();
    table.string('cpf').notNullable().unique();
    table.string('street_number').notNullable();
    table.string('street_complement');
    table.string('street_neighborhood').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('zip_code').notNullable();
    table.string('street_address').notNullable();
    table.string('observation').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('donors');
}
