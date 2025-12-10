"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFoodBasketSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const productIdSchema = zod_1.default.object({
    product_id: zod_1.default
        .number('ID do produto inválido')
        .min(1, 'ID do produto é obrigatório')
        .nonnegative('ID do produto inválido'),
    quantity: zod_1.default
        .number('Quantidade inválida')
        .min(1, 'Quantidade deve ser ao menos 1'),
});
const createFoodBasketSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, 'Nome  é obrigatório'),
    description: zod_1.default.string().optional(),
    is_active: zod_1.default.boolean().default(true),
    products: zod_1.default
        .array(productIdSchema)
        .min(1, 'Ao menos um produto é obrigatório'),
});
exports.createFoodBasketSchema = createFoodBasketSchema;
