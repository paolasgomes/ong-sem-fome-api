import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  is_perishable: z.boolean().optional().default(false),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
