import { db } from '../../../database/connection';
import { Request, Response } from 'express';

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias com paginação
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página atual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista paginada de doadores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Donor'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro ao buscar doadores
 */

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const result = await db('categories')
      .select('*')
      .paginate({
        perPage: limit ? Number(limit) : 10,
        currentPage: page ? Number(page) : 1,
        isLengthAware: true,
      });

    const totalPages = result.pagination.lastPage || 1;

    const formattedData = result.data.map((category) => ({
      ...category,
      is_perishable: Boolean(category?.is_perishable),
    }));

    return res.json({
      results: formattedData,
      page: result.pagination.currentPage,
      limit: result.pagination.perPage,
      total: result.pagination.total,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

export { getAllCategories };
