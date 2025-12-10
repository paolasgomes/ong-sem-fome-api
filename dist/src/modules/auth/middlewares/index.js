"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Acesso negado ' });
    }
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;
    try {
        const secret = process.env.JWT_SECRET || 'secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.error('❌ Erro na verificação do token:', error);
        res.status(401).json({ error: 'Token inválido' });
    }
};
exports.verifyToken = verifyToken;
