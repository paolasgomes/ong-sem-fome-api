import z from 'zod';

const createCampaignSchema = z
  .object({
    name: z.string().min(1, 'O nome é obrigatório'),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Data de início inválida',
    }),
    end_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Data de término inválida',
      })
      .optional(),
    is_active: z.boolean().optional().default(true),
    description: z.string().optional().nullable(),
    goal_quantity: z.number().int().nonnegative().optional().nullable(),
    goal_amount: z.number().nonnegative().optional().nullable(),
    campaign_type: z
      .enum(['money', 'food', 'clothing'], 'O tipo de campanha é obrigatório')
      .default('food'),
  })
  .superRefine((data, ctx) => {
    const startDate = new Date(data.start_date);
    if (data.end_date) {
      const endDate = new Date(data.end_date);

      if (endDate < startDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'A data de término deve ser posterior à data de início',
          path: ['end_date'],
        });
      }

      if (data.campaign_type === 'food' && !data.goal_quantity) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Campanhas do tipo "food" devem ter uma meta de quantidade definida',
          path: ['goal_quantity'],
        });
      }

      if (data.campaign_type === 'clothing' && !data.goal_quantity) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Campanhas do tipo "clothing" devem ter uma meta de quantidade definida',
          path: ['goal_quantity'],
        });
      }

      if (data.campaign_type === 'money' && !data.goal_amount) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Campanhas do tipo "money" devem ter uma meta de valor definida',
          path: ['goal_amount'],
        });
      }
    }
  });

export { createCampaignSchema };
