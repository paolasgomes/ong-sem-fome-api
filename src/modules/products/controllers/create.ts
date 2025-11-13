import { Request, Response } from 'express';
import { db } from '@/database/connection';
import {
  createProductSchema,
  updateProductSchema,
  CreateProductInput,
  UpdateProductInput,
} from '../schemas';

const createProduct = async (req: Request, res: Response) => {
  try {
    const validation = createProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Dados inválidos', details: validation.error._zod });
    }
    const data: CreateProductInput = validation.data;

    if (data.category_id) {
      const category = await db('categories').where({ id: data.category_id }).first();
      if (!category) return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    const insertPayload = {
      name: data.name,
      unit: data.unit ?? 'quilogramas',
      minimum_stock: data.minimum_stock ?? 0,
      is_active: data.is_active ?? true,
      category_id: data.category_id ?? null,
      created_at: db.fn.now(),
      updated_at: null,
    };

    const [id] = await db('products').insert(insertPayload);
    const product = await db('products').where({ id }).first();

    return res.status(201).json(product);
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ error: 'Erro ao criar produto', details: error?.message });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const validation = updateProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Dados inválidos', details: validation.error._zod });
    }
    const data: UpdateProductInput = validation.data;

    const existing = await db('products').where({ id }).first();
    if (!existing) return res.status(404).json({ error: 'Produto não encontrado' });

    if (data.category_id !== undefined && data.category_id !== null) {
      const category = await db('categories').where({ id: data.category_id }).first();
      if (!category) return res.status(404).json({ error: 'Categoria não encontrada' });
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
    return res.status(500).json({ error: 'Erro ao atualizar produto', details: error?.message });
  }
};

export { createProduct, updateProduct };
