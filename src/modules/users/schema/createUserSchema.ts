import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z
    .string()
    .min(6, 'O tamanho minimo da senha é 6 caracteres')
    .max(72, 'O tamanho máximo da senha é 72 caracteres'),
  role: z.enum(['admin', 'logistica', 'financeiro']),
});

export { createUserSchema };
