"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
authRoutes.post('/', auth_1.login);
