"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const updateStatusSchema = zod_1.default.object({
    status: zod_1.default.enum(['pending', 'delivered', 'canceled'], 'O status é obrigatório'),
});
exports.updateStatusSchema = updateStatusSchema;
