"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = void 0;
const schemas_1 = require("../schemas");
const connection_1 = require("@/database/connection");
const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const validation = schemas_1.updateProductSchema.safeParse(req.body);
        if (!validation.success) {
            return res
                .status(400)
                .json({ error: 'Dados inválidos', details: validation.error._zod });
        }
        const data = validation.data;
        const existing = await (0, connection_1.db)('products').where({ id }).first();
        if (!existing)
            return res.status(404).json({ error: 'Produto não encontrado' });
        if (data.category_id !== undefined && data.category_id !== null) {
            const category = await (0, connection_1.db)('categories')
                .where({ id: data.category_id })
                .first();
            if (!category)
                return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        const updatePayload = {
            ...data,
            updated_at: connection_1.db.fn.now(),
        };
        await (0, connection_1.db)('products').where({ id }).update(updatePayload);
        const updated = await (0, connection_1.db)('products').where({ id }).first();
        return res.status(200).json(updated);
    }
    catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return res
            .status(500)
            .json({ error: 'Erro ao atualizar produto', details: error?.message });
    }
};
exports.updateProduct = updateProduct;
