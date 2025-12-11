import { hashPassword } from '../../utils/hashPassword';
import knexLib from 'knex';

type Knex = ReturnType<typeof knexLib>;

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert([
    {
      name: 'Admin User',
      email: 'admin@ongsemfome2.com',
      password: await hashPassword('admin123'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);
}
