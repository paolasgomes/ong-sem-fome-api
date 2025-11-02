import z from 'zod';

const updateIsActiveSchema = z.object({
  is_active: z.boolean(),
});

export { updateIsActiveSchema };
