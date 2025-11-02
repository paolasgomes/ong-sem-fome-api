import { z } from 'zod';

const isoDateString = (val: unknown) =>
  typeof val === 'string' && !Number.isNaN(Date.parse(val));

const createCollaboratorSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  registration: z.string().min(1, 'Matrícula é obrigatória'),
  email: z.email('Email inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  admission_date: z
    .string()
    .optional()
    .refine((v) => (v === undefined ? true : isoDateString(v)), {
      message: 'admission_date deve ser uma data ISO válida',
    }),
  dismissal_date: z
    .string()
    .optional()
    .nullable()
    .refine((v) => (v === null || v === undefined ? true : isoDateString(v)), {
      message: 'dismissal_date deve ser uma data ISO válida ou null',
    }),
  is_volunteer: z.boolean().optional().default(false),
  sector_id: z.number().int().positive().optional().nullable(),
  user_id: z.number().int().positive().optional().nullable(),
  is_active: z.boolean().optional().default(true),
});

export { createCollaboratorSchema };
