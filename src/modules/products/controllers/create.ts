import { Request, Response } from 'express';
import { db } from '@/database/connection';
import { createProductSchema, CreateProductInput } from '../schemas';

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Arroz"
 *               unit:
 *                 type: string
 *                 example: "quilogramas"
 *               minimum_stock:
 *                 type: integer
 *                 example: 10
 *               is_active:
 *                 type: boolean
 *                 example: true
 *               category_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria não encontrada
 *       409:
 *         description: Produto já existe nessa categoria
 *       500:
 *         description: Erro interno do servidor
 */

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

    const [id] = await db('products').insert(data);

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
