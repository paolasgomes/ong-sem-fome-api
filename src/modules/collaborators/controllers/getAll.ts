import { db } from '../../../database/connection';
import { Request, Response } from 'express';

/**
 * @swagger
 * /collaborators:
 *   get:
 *     summary: Lista todos os colaboradores com paginação
 *     tags: [Collaborators]
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
 *         description: Lista paginada de colaboradores (cada item inclui os objetos 'sector' e 'user')
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
 *                       name:
 *                         type: string
 *                       registration:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       admission_date:
 *                         type: string
 *                         format: date-time
 *                       dismissal_date:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       is_volunteer:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                       updated_at:
 *                         type: string
 *                         nullable: true
 *                       sector:
 *                         type: object
 *                         description: Objeto do setor relacionado (pode ser null)
 *                         $ref: '#/components/schemas/Sector'
 *                       user:
 *                         type: object
 *                         description: Objeto do usuário relacionado (pode ser null). A propriedade 'password' não é retornada.
 *                         $ref: '#/components/schemas/User'
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
 *         description: Erro ao buscar colaboradores
 */

const getAllCollaborators = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const result = await db('collaborators')
      .select('*')
      .paginate({
        perPage: limit ? Number(limit) : 10,
        currentPage: page ? Number(page) : 1,
        isLengthAware: true,
      });

    const collaborators = result.data;

    const sectorIds = Array.from(
      new Set(collaborators.map((c) => c.sector_id).filter(Boolean)),
    );
    const userIds = Array.from(
      new Set(collaborators.map((c) => c.user_id).filter(Boolean)),
    );

    const sectors = sectorIds.length
      ? await db('sectors').whereIn('id', sectorIds).select('*')
      : [];
    const users = userIds.length
      ? await db('users').whereIn('id', userIds).select('*')
      : [];

    const sectorMap = Object.fromEntries(sectors.map((s) => [s.id, s]));

    const sanitizedUsers = users.map((u) => {
      const { password, deleted_at, created_at, updated_at, ...rest } = u;
      return rest;
    });

    const userMap = Object.fromEntries(sanitizedUsers.map((u) => [u.id, u]));

    const enriched = collaborators.map((c) => {
      const { sector_id, user_id, ...rest } = c;
      return {
        ...rest,
        is_active: c.is_active === 1,
        sector: sector_id ? (sectorMap[sector_id] ?? null) : null,
        user: user_id ? (userMap[user_id] ?? null) : null,
      };
    });

    const totalPages = result.pagination.lastPage || 1;

    return res.json({
      results: enriched,
      page: result.pagination.currentPage,
      limit: result.pagination.perPage,
      total: result.pagination.total,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar colaboradores' });
  }
};

export { getAllCollaborators };
