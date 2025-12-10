"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const connection_1 = require("../../../database/connection");
const createUserSchema_1 = require("../schema/createUserSchema");
const hashPassword_1 = require("@/utils/hashPassword");
/**
 * @swagger
 * /users:
 *   put:
 *     summary: Atualiza um usuário existente
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
 *       200:
 *         description: Usuário atualizado com sucesso
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
const updateUser = async (req, res) => {
    try {
        const validation = createUserSchema_1.createUserSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: validation.error._zod,
            });
        }
        const data = validation.data;
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const existingUserQuery = (0, connection_1.db)('users')
            .where(function () {
            if (data.email)
                this.orWhere('email', data.email);
        })
            .andWhereNot('id', id)
            .first();
        const existingUser = await existingUserQuery;
        if (existingUser) {
            return res.status(400).json({
                error: 'Já existe um usuário com este email',
            });
        }
        await (0, connection_1.db)('users')
            .where({ id })
            .update({
            name: data.name,
            email: data.email,
            role: data.role,
            updated_at: connection_1.db.fn.now(),
            ...(data.password && { password: await (0, hashPassword_1.hashPassword)(data.password) }),
        });
        const updatedUser = await (0, connection_1.db)('users').where({ id }).first();
        const { password: _, ...rest } = updatedUser;
        return res.status(200).json(rest);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: 'Erro ao atualizar usuário', description: error });
    }
};
exports.updateUser = updateUser;
