import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('sectors').del();

  const now = knex.fn.now();

  await knex('sectors').insert([
    {
      name: 'Administração',
    },
    {
      name: 'Logística',
    },
    {
      name: 'Voluntariado',
    },
    {
      name: 'Financeiro',
    },
    {
      name: 'Comunicação',
    },
  ]);
}
