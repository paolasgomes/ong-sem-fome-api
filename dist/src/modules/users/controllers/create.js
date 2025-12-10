"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const connection_1 = require("../../../database/connection");
const createUserSchema_1 = require("../schema/createUserSchema");
const hashPassword_1 = require("@/utils/hashPassword");
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ['admin', 'logistica', 'financeiro']
 *                 example: 'admin'
 *               name:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao.silva@example.com
 *               password:
 *                 type: string
 *                 example: "11999999999"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos ou duplicados
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
const createUser = async (req, res) => {
    try {
        const validation = createUserSchema_1.createUserSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: validation.error._zod,
            });
        }
        const { name, email, password, role } = validation.data;
        const existingUser = await (0, connection_1.db)('users').where('email', email).first();
        if (existingUser) {
            return res.status(400).json({
                error: 'Já existe um usuário com esse email',
            });
        }
        const [id] = await (0, connection_1.db)('users').insert({
            name,
            email,
            password: await (0, hashPassword_1.hashPassword)(password),
            role,
        });
        const user = await (0, connection_1.db)('users').where({ id }).first();
        const { password: _, ...rest } = user;
        return res.status(201).json(rest);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: 'Erro ao criar usuário', description: error });
    }
};
exports.createUser = createUser;
