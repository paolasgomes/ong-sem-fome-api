"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDonorSchema = void 0;
const zod_1 = require("zod");
const createDonorSchema = zod_1.z
    .object({
    type: zod_1.z.enum(['pessoa_fisica', 'pessoa_juridica']),
    name: zod_1.z.string().min(1),
    email: zod_1.z.email(),
    phone: zod_1.z.string().min(1),
    cpf: zod_1.z
        .string()
        .length(11)
        .regex(/^\d{11}$/)
        .optional(),
    cnpj: zod_1.z
        .string()
        .length(14)
        .regex(/^\d{14}$/)
        .optional(),
    street_number: zod_1.z.string().min(1),
    street_complement: zod_1.z.string().optional(),
    street_neighborhood: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    state: zod_1.z.string().min(1),
    zip_code: zod_1.z.string().min(1),
    street_address: zod_1.z.string().min(1),
    observation: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().optional().default(true),
})
    .superRefine((data, ctx) => {
    if (data.type === 'pessoa_fisica' && !data.cpf) {
        ctx.addIssue({
            code: 'custom',
            message: 'CPF é obrigatório para pessoa física',
        });
    }
    if (data.type === 'pessoa_juridica' && !data.cnpj) {
        ctx.addIssue({
            code: 'custom',
            message: 'CNPJ é obrigatório para pessoa jurídica',
        });
    }
});
exports.createDonorSchema = createDonorSchema;
