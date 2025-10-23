import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('donors', (table) => {
    table.string('cpf').nullable().alter();
  });

  try {
    await knex.schema.alterTable('donors', (table) => {
      table.unique(['cpf']);
    });
  } catch (error: any) {
    if (error && /already exists/i.test(String(error.message))) {
      return;
    }
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  try {
    await knex.schema.alterTable('donors', (table) => {
      table.dropUnique(['cpf']);
    });
  } catch (error: any) {
    if (
      error &&
      /no such index|not exist|does not exist/i.test(String(error.message))
    ) {
    } else {
      throw error;
    }
  }

  await knex.schema.alterTable('donors', (table) => {
    table.string('cpf').notNullable().alter();
  });
}
