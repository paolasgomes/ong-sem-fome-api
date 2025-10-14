import z from 'zod';

const authSchema = z.object({
  email: z
    .email({ message: 'Formato de email inválido' })
    .min(1, { message: 'Email é obrigatório' }),
  password: z.string().min(1),
});

export { authSchema };
