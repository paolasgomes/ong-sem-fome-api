import z from 'zod';

const createDistributionSchema = z.object({
  food_basket_id: z
    .number('ID da cesta de alimentos inválido')
    .min(1, 'ID da cesta de alimentos é obrigatório')
    .nonnegative('ID da cesta de alimentos inválido'),
  collaborator_id: z
    .number('ID do colaborador inválido')
    .min(1, 'ID do colaborador é obrigatório')
    .nonnegative('ID do colaborador inválido'),
  campaign_id: z
    .number('ID da campanha inválido')
    .min(1, 'ID da campanha é obrigatório')
    .nonnegative('ID da campanha inválido')
    .optional(),
  family_id: z
    .number('ID da família inválido')
    .min(1, 'ID da família é obrigatório')
    .nonnegative('ID da família inválido'),
  observations: z
    .string()
    .max(500, 'Observações podem ter no máximo 500 caracteres')
    .optional(),
  delivery_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de entrega inválida',
  }),
  status: z.enum(['pending', 'delivered', 'canceled']).default('pending'),
});

interface CreateDistributionInput
  extends z.infer<typeof createDistributionSchema> {}

export { createDistributionSchema, CreateDistributionInput };
