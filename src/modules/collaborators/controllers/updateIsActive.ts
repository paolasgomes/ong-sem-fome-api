import { db } from '@/database/connection';
import { Request, Response } from 'express';
import { updateIsActiveSchema } from '../schemas/updateIsActive';

/**
 * @swagger
 * /collaborators/{id}/is-active:
 *   patch:
 *     summary: Atualiza o status ativo (is_active) de um colaborador
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: boolean
 *             required:
 *               - is_active
 *     responses:
 *       201:
 *         description: Status atualizado com sucesso
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
 *                   type: boolean
 *                 is_active:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *                   nullable: true
 *                 sector_id:
 *                   type: integer
 *                   nullable: true
 *                 user_id:
 *                   type: integer
 *                   nullable: true
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Colaborador não encontrado
 *       500:
 *         description: Erro ao atualizar colaborador
 */

const updateIsActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { is_active } = req.body;

    const hasExistingCollaborator = await db('collaborators')
      .where({ id })
      .first();

    if (!hasExistingCollaborator) {
      return res.status(404).json({
        error: 'Colaborador não encontrado',
      });
    }

    const validation = updateIsActiveSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const data = validation.data;

    await db('collaborators').where({ id }).update({
      is_active: data.is_active,
      updated_at: db.fn.now(),
    });

    const collaborator = await db('collaborators').where({ id }).first();

    const formattedCollaborator = {
      ...collaborator,
      is_active: collaborator.is_active === 1,
      is_volunteer: collaborator.is_volunteer === 1,
    };

    return res.status(201).json(formattedCollaborator);
  } catch (error) {
    console.log('error => ', error);
    return res.status(500).json({ error: 'Erro ao atualizar colaborador' });
  }
};

export { updateIsActive };
