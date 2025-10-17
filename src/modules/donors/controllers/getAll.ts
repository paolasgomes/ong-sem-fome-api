import { db } from '@/database/connection';
import { Request, Response } from 'express';

/**
 * @swagger
 * /donors:
 *   get:
 *     summary: Lista todos os doadores com paginação
 *     tags: [Donors]
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       type:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       cpf:
 *                         type: string
 *                       street_number:
 *                         type: string
 *                       street_complement:
 *                         type: string
 *                       street_neighborhood:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       zip_code:
 *                         type: string
 *                       street_address:
 *                         type: string
 *                       observation:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Erro ao buscar doadores
 */

const getAllDonors = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const result = await db('donors')
      .select('*')
      .paginate({
        perPage: limit ? Number(limit) : 10,
        currentPage: page ? Number(page) : 1,
        isLengthAware: true,
      });

    const totalPages = result.pagination.lastPage || 1;

    return res.json({
      results: result.data,
      page: result.pagination.currentPage,
      limit: result.pagination.perPage,
      total: result.pagination.total,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar doadores' });
  }
};

export { getAllDonors };
