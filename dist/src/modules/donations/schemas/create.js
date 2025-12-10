"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDonationSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../enums");
const createDonationSchema = zod_1.z
    .object({
    type: zod_1.z.enum(enums_1.ALLOWED_TYPES, 'Os tipos permitidos são food, clothing, money, campaign'),
    unit: zod_1.z
        .enum(enums_1.ALLOWED_UNITS, 'As unidades permitidas são kg, g, l, ml, un')
        .nullable()
        .optional(),
    amount: zod_1.z.number('amount deve ser um número').nullable().optional(),
    quantity: zod_1.z
        .number('quantity deve ser um número')
        .int()
        .nullable()
        .optional(),
    observations: zod_1.z.string().nullable().optional(),
    donor_id: zod_1.z.number('donor_id deve ser um número').int().positive(),
    campaign_id: zod_1.z
        .number('campaign_id deve ser um número')
        .int()
        .positive()
        .nullable()
        .optional(),
    collaborator_id: zod_1.z
        .number('collaborator_id deve ser um número')
        .int()
        .positive(),
    product_id: zod_1.z
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
    }
    else {
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
                message: 'Para doações do tipo campaign deve ser preenchido amount ou quantity',
                path: ['amount', 'quantity'],
            });
        }
        if (quantity && !unit) {
            ctx.addIssue({
                code: 'custom',
                message: 'unit é obrigatório quando quantity é fornecido para doações do tipo campaign',
                path: ['unit'],
            });
        }
    }
});
exports.createDonationSchema = createDonationSchema;
