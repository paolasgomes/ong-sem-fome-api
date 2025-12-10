"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.email(),
    password: zod_1.z
        .string()
        .min(6, 'O tamanho minimo da senha é 6 caracteres')
        .max(72, 'O tamanho máximo da senha é 72 caracteres'),
    role: zod_1.z.enum(['admin', 'logistica', 'financeiro']),
});
exports.createUserSchema = createUserSchema;
