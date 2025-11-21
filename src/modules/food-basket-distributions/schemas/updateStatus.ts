import { stat } from 'fs';
import z from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(
    ['pending', 'delivered', 'canceled'],
    'O status é obrigatório',
  ),
});
export { updateStatusSchema };
