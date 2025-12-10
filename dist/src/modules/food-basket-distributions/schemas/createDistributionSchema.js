"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDistributionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const createDistributionSchema = zod_1.default.object({
    food_basket_id: zod_1.default
        .number('ID da cesta de alimentos inválido')
        .min(1, 'ID da cesta de alimentos é obrigatório')
        .nonnegative('ID da cesta de alimentos inválido'),
    collaborator_id: zod_1.default
        .number('ID do colaborador inválido')
        .min(1, 'ID do colaborador é obrigatório')
        .nonnegative('ID do colaborador inválido'),
    campaign_id: zod_1.default
        .number('ID da campanha inválido')
        .min(1, 'ID da campanha é obrigatório')
        .nonnegative('ID da campanha inválido')
        .optional(),
    family_id: zod_1.default
        .number('ID da família inválido')
        .min(1, 'ID da família é obrigatório')
        .nonnegative('ID da família inválido'),
    observations: zod_1.default
        .string()
        .max(500, 'Observações podem ter no máximo 500 caracteres')
        .optional(),
    delivery_date: zod_1.default.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Data de entrega inválida',
    }),
    status: zod_1.default.enum(['pending', 'delivered', 'canceled']).default('pending'),
});
exports.createDistributionSchema = createDistributionSchema;
