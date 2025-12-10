"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIsActiveSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const updateIsActiveSchema = zod_1.default.object({
    is_active: zod_1.default.boolean(),
});
exports.updateIsActiveSchema = updateIsActiveSchema;
