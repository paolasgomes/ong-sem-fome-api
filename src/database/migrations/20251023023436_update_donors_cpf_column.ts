import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('donors', (table) => {
    table.string('cpf', 14).nullable().alter();
    // sem ADD UNIQUE aqui
  });
}

export async function down(knex: Knex): Promise<void> {
  // se quiser, só volta o tipo
  await knex.schema.alterTable('donors', (table) => {
    table.string('cpf', 14).notNullable().alter();
  });
}
