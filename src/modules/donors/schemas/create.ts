import { z } from 'zod';

const createDonorSchema = z.object({
  type: z.enum(['pessoa_fisica', 'pessoa_juridica']),
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  cpf: z
    .string()
    .length(11)
    .regex(/^\d{11}$/),
  street_number: z.string().min(1),
  street_complement: z.string().optional(),
  street_neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip_code: z.string().min(1),
  street_address: z.string().min(1),
  observation: z.string().optional(),
});

export { createDonorSchema };
