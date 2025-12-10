"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'O nome é obrigatório'),
    unit: zod_1.z.string().min(1).optional().default('quilogramas'),
    minimum_stock: zod_1.z.number().int().nonnegative().optional().default(0),
    in_stock: zod_1.z.number().int().nonnegative().optional().default(0),
    is_active: zod_1.z.boolean().optional().default(true),
    category_id: zod_1.z.number().int().positive().nullable().optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
