import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const tables = ['families', 'donors', 'users'];

  for (const tableName of tables) {
    await knex.schema.alterTable(tableName, (table) => {
      table.timestamp('deleted_at').nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const tables = ['families', 'donors', 'users'];

  for (const tableName of tables) {
    await knex.schema.alterTable(tableName, (table) => {
      table.dropColumn('deleted_at');
    });
  }
}
