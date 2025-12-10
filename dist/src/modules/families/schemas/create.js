"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFamilySchema = void 0;
const zod_1 = require("zod");
exports.createFamilySchema = zod_1.z.object({
    responsible_name: zod_1.z.string().min(1),
    responsible_cpf: zod_1.z
        .string()
        .length(11)
        .regex(/^\d{11}$/),
    street_number: zod_1.z.string().min(1),
    street_complement: zod_1.z.string().optional(),
    street_neighborhood: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    state: zod_1.z.string().min(1),
    zip_code: zod_1.z.string().min(1),
    street_address: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(1),
    email: zod_1.z.email(),
    members_count: zod_1.z.number().int().min(1),
    income_bracket: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    observation: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().optional().default(true),
});
