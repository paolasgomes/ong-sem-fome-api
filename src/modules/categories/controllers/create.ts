import { Request, Response } from 'express';
import { db } from '@/database/connection';
import {
  createCategorySchema,
  updateCategorySchema,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../schemas/create';

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
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
 *                 example: "Alimentos"
 *               is_perishable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
const createCategory = async (req: Request, res: Response) => {
  try {
    const validation = createCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: 'Dados inválidos', details: validation.error._zod });
    }
    const data: CreateCategoryInput = validation.data;

    const exixtingCategory = await db('categories')
      .where({ name: data.name })
      .first();

    if (exixtingCategory) {
      return res.status(400).json({ error: 'Categoria já existe' });
    }

    const insertPayload = {
      name: data.name,
      is_perishable: data.is_perishable ?? false,
      created_at: db.fn.now(),
      updated_at: null,
    };

    const [id] = await db('categories').insert(insertPayload);

    const category = await db('categories').where({ id }).first();

    const formattedCategory = {
      ...category,
      is_perishable: Boolean(category?.is_perishable),
    };

    return res.status(201).json(formattedCategory);
  } catch (error: any) {
    console.error('Erro ao criar categoria:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao criar categoria', details: error?.message });
  }
};

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               is_perishable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const validation = updateCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: 'Dados inválidos', details: validation.error._zod });
    }
    const data: UpdateCategoryInput = validation.data;

    const existing = await db('categories').where({ id }).first();
    if (!existing)
      return res.status(404).json({ error: 'Categoria não encontrada' });

    const updatePayload: Partial<typeof existing> = {
      ...data,
      updated_at: db.fn.now(),
    };

    await db('categories').where({ id }).update(updatePayload);
    const updated = await db('categories').where({ id }).first();

    return res.status(200).json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar categoria:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao atualizar categoria', details: error?.message });
  }
};

export { createCategory, updateCategory };
