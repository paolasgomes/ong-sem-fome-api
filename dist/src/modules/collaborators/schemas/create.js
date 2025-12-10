"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollaboratorSchema = void 0;
const zod_1 = require("zod");
const isoDateString = (val) => typeof val === 'string' && !Number.isNaN(Date.parse(val));
const createCollaboratorSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nome é obrigatório'),
    registration: zod_1.z.string().min(1, 'Matrícula é obrigatória'),
    email: zod_1.z.email('Email inválido'),
    phone: zod_1.z.string().min(1, 'Telefone é obrigatório'),
    admission_date: zod_1.z
        .string()
        .optional()
        .refine((v) => (v === undefined ? true : isoDateString(v)), {
        message: 'admission_date deve ser uma data ISO válida',
    }),
    dismissal_date: zod_1.z
        .string()
        .optional()
        .nullable()
        .refine((v) => (v === null || v === undefined ? true : isoDateString(v)), {
        message: 'dismissal_date deve ser uma data ISO válida ou null',
    }),
    is_volunteer: zod_1.z.boolean().optional().default(false),
    sector_id: zod_1.z.number().int().positive().optional().nullable(),
    user_id: zod_1.z.number().int().positive().optional().nullable(),
    is_active: zod_1.z.boolean().optional().default(true),
});
exports.createCollaboratorSchema = createCollaboratorSchema;
