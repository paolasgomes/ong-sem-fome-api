import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  in_stock: z.number().int().nonnegative().optional().default(0),
  unit: z.string().min(1).optional().default('quilogramas'),
  minimum_stock: z.number().int().nonnegative().optional().default(0),
  is_active: z.boolean().optional().default(true),
  category_id: z.number().int().positive().nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
