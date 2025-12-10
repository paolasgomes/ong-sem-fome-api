"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'O nome é obrigatório'),
    is_perishable: zod_1.z.boolean().optional().default(false),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
