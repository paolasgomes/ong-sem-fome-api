import knexLib from 'knex';
import bcrypt from 'bcrypt';

type Knex = ReturnType<typeof knexLib>;

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert([
    {
      name: 'Admin User',
      email: 'admin@ongsemfome.com',
      password: await hashPassword('admin123'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);
}
