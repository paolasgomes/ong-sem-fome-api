import { db } from '@/database/connection';
import { Request, Response } from 'express';

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os doadores com paginação
 *     tags: [Users]
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
 *         description: Lista paginada de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Users'
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
 *         description: Erro ao buscar usuários
 */

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const result = await db('users')
      .select('*')
      .paginate({
        perPage: limit ? Number(limit) : 10,
        currentPage: page ? Number(page) : 1,
        isLengthAware: true,
      });

    const totalPages = result.pagination.lastPage || 1;

    const formattedResults = result.data.map((user) => {
      const { password, ...rest } = user;

      return rest;
    });

    return res.json({
      results: formattedResults,
      page: result.pagination.currentPage,
      limit: result.pagination.perPage,
      total: result.pagination.total,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

export { getAllUsers };
