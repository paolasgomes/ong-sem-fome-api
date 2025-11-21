import z from 'zod';

const productIdSchema = z.object({
  product_id: z
    .number('ID do produto inválido')
    .min(1, 'ID do produto é obrigatório')
    .nonnegative('ID do produto inválido'),
  quantity: z
    .number('Quantidade inválida')
    .min(1, 'Quantidade deve ser ao menos 1'),
});

const createFoodBasketSchema = z.object({
  name: z.string().min(1, 'Nome  é obrigatório'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  products: z
    .array(productIdSchema)
    .min(1, 'Ao menos um produto é obrigatório'),
});

export { createFoodBasketSchema };
