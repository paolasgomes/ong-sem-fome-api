import { Request, Response } from 'express';
import { db } from '@/database/connection';
import { createProductSchema, CreateProductInput } from '../schemas';

const createProduct = async (req: Request, res: Response) => {
  try {
    const validation = createProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: 'Dados inválidos', details: validation.error._zod });
    }
    const data: CreateProductInput = validation.data;

    if (data.category_id) {
      const category = await db('categories')
        .where({ id: data.category_id })
        .first();

      if (!category)
        return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    const existingProduct = await db('products')
      .where({ name: data.name })
      .andWhere('category_id', data.category_id)
      .first();

    if (existingProduct) {
      return res
        .status(409)
        .json({ error: 'Produto já existe nessa categoria' });
    }

    const insertPayload = {
      name: data.name,
      unit: data.unit ?? 'quilogramas',
      minimum_stock: data.minimum_stock ?? 0,
      is_active: data.is_active ?? true,
      category_id: data.category_id,
      created_at: db.fn.now(),
      updated_at: null,
    };

    const [id] = await db('products').insert(insertPayload);

    const product = await db('products').where({ id }).first();

    const formattedProduct = {
      ...product,
      is_active: Boolean(product?.is_active),
    };

    return res.status(201).json(formattedProduct);
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao criar produto', details: error?.message });
  }
};

export { createProduct };
