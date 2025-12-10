import { db } from '../../../database/connection';
import { Request, Response } from 'express';

/**
 * @swagger
 * /collaborators/{id}:
 *   get:
 *     summary: Busca um colaborador pelo ID (inclui sector e user)
 *     tags: [Collaborators]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do colaborador
 *     responses:
 *       200:
 *         description: Colaborador encontrado (sem sector_id/user_id; user sem password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 registration:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 admission_date:
 *                   type: string
 *                   format: date-time
 *                 dismissal_date:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 is_volunteer:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *                   nullable: true
 *                 sector:
 *                   $ref: '#/components/schemas/Sector'
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Colaborador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

const getCollaboratorById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const collaborator = await db('collaborators').where({ id }).first();

    if (!collaborator) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    const { sector_id, user_id, ...rest } = collaborator;

    const [sector, user] = await Promise.all([
      sector_id
        ? db('sectors').where({ id: sector_id }).first()
        : Promise.resolve(null),
      user_id
        ? db('users').where({ id: user_id }).first()
        : Promise.resolve(null),
    ]);

    const sanitizedUser = user
      ? (() => {
          const { password, deleted_at, created_at, updated_at, ...u } = user;
          return u;
        })()
      : null;

    return res.json({
      ...rest,
      is_active: collaborator.is_active === 1,
      sector: sector ?? null,
      user: sanitizedUser,
    });
  } catch (error: any) {
    console.error('Erro ao buscar colaborador por id:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao buscar colaborador', details: error?.message });
  }
};

export { getCollaboratorById };
