import { z } from 'zod';
import { ALLOWED_TYPES, ALLOWED_UNITS } from '../enums';

const createDonationSchema = z
  .object({
    type: z.enum(
      ALLOWED_TYPES,
      'Os tipos permitidos são food, clothing, money, campaign',
    ),
    unit: z
      .enum(ALLOWED_UNITS, 'As unidades permitidas são kg, g, l, ml, un')
      .nullable()
      .optional(),
    amount: z.number('amount deve ser um número').nullable().optional(),
    quantity: z
      .number('quantity deve ser um número')
      .int()
      .nullable()
      .optional(),
    observations: z.string().nullable().optional(),
    donor_id: z.number('donor_id deve ser um número').int().positive(),
    campaign_id: z
      .number('campaign_id deve ser um número')
      .int()
      .positive()
      .nullable()
      .optional(),
    collaborator_id: z
      .number('collaborator_id deve ser um número')
      .int()
      .positive(),
    product_id: z
      .number('product_id deve ser um número')
      .int()
      .positive()
      .nullable()
      .optional(),
  })
  .superRefine((val, ctx) => {
    const { type, amount, quantity, campaign_id, product_id, unit } = val;

    if (type === 'money') {
      if (!amount) {
        ctx.addIssue({
          code: 'custom',
          message: 'amount é obrigatório para doações do tipo money',
          path: ['amount'],
        });
      }
    } else {
      if (!quantity) {
        ctx.addIssue({
          code: 'custom',
          message: 'quantity é obrigatório para doações não monetárias',
          path: ['quantity'],
        });
      }
      if (!unit) {
        ctx.addIssue({
          code: 'custom',
          message: 'unit é obrigatório para doações não monetárias',
          path: ['unit'],
        });
      }
      if (!product_id) {
        ctx.addIssue({
          code: 'custom',
          message: 'product_id é obrigatório para doações não monetárias',
          path: ['product_id'],
        });
      }
    }

    if (type === 'campaign') {
      if (!campaign_id) {
        ctx.addIssue({
          code: 'custom',
          message: 'campaign_id é obrigatório para doações do tipo campaign',
          path: ['campaign_id'],
        });
      }
      if (!amount && !quantity) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Para doações do tipo campaign deve ser preenchido amount ou quantity',
          path: ['amount', 'quantity'],
        });
      }
      if (quantity && !unit) {
        ctx.addIssue({
          code: 'custom',
          message:
            'unit é obrigatório quando quantity é fornecido para doações do tipo campaign',
          path: ['unit'],
        });
      }
    }
  });

export type CreateDonationInput = z.infer<typeof createDonationSchema>;

export { createDonationSchema };
