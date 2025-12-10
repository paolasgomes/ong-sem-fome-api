"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignSchema = exports.updateCampaignSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const createCampaignSchema = zod_1.default
    .object({
    name: zod_1.default.string().min(1, 'O nome é obrigatório'),
    start_date: zod_1.default.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Data de início inválida',
    }),
    end_date: zod_1.default
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Data de término inválida',
    })
        .optional(),
    is_active: zod_1.default.boolean().optional().default(true),
    description: zod_1.default.string().optional().nullable(),
    goal_quantity: zod_1.default.number().int().nonnegative().optional().nullable(),
    goal_amount: zod_1.default.number().nonnegative().optional().nullable(),
    campaign_type: zod_1.default
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
                message: 'Campanhas do tipo "food" devem ter uma meta de quantidade definida',
                path: ['goal_quantity'],
            });
        }
        if (data.campaign_type === 'clothing' && !data.goal_quantity) {
            ctx.addIssue({
                code: 'custom',
                message: 'Campanhas do tipo "clothing" devem ter uma meta de quantidade definida',
                path: ['goal_quantity'],
            });
        }
        if (data.campaign_type === 'money' && !data.goal_amount) {
            ctx.addIssue({
                code: 'custom',
                message: 'Campanhas do tipo "money" devem ter uma meta de valor definida',
                path: ['goal_amount'],
            });
        }
    }
});
exports.createCampaignSchema = createCampaignSchema;
exports.updateCampaignSchema = createCampaignSchema.partial();
