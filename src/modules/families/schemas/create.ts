import { z } from 'zod';

export const createFamilySchema = z.object({
  responsible_name: z.string().min(1),
  responsible_cpf: z
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
  phone: z.string().min(1),
  email: z.email(),
  members_count: z.number().int().min(1),
  income_bracket: z.string().min(1),
  address: z.string().min(1),
  observation: z.string().optional(),
  is_active: z.boolean().optional().default(true),
});
