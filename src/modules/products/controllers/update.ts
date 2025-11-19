import { Request, Response } from 'express';
import { UpdateProductInput, updateProductSchema } from '../schemas';
import { db } from '@/database/connection';

const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const validation = updateProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: 'Dados inválidos', details: validation.error._zod });
    }
    const data: UpdateProductInput = validation.data;

    const existing = await db('products').where({ id }).first();
    if (!existing)
      return res.status(404).json({ error: 'Produto não encontrado' });

    if (data.category_id !== undefined && data.category_id !== null) {
      const category = await db('categories')
        .where({ id: data.category_id })
        .first();
      if (!category)
        return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    const updatePayload: any = {
      ...data,
      updated_at: db.fn.now(),
    };

    await db('products').where({ id }).update(updatePayload);

    const updated = await db('products').where({ id }).first();

    return res.status(200).json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao atualizar produto', details: error?.message });
  }
};

export { updateProduct };
