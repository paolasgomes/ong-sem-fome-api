import z from 'zod';

const updateStockSchema = z.object({
  quantity: z.number().int().nonnegative(),
});

export { updateStockSchema };
