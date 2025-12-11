import { Request, Response } from 'express';
import { db } from '../../../database/connection';
import { createCollaboratorSchema } from '../schemas/create';
import { is } from 'zod/v4/locales';

/**
 * @swagger
 * /collaborators:
 *   post:
 *     summary: Cria um novo colaborador
 *     tags: [Collaborators]
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
 *               - registration
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Oliveira
 *               registration:
 *                 type: string
 *                 example: "123456"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria.oliveira@example.com"
 *               phone:
 *                 type: string
 *                 example: "11988887777"
 *               admission_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-01-01T00:00:00.000Z"
 *               dismissal_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: null
 *               is_volunteer:
 *                 type: boolean
 *                 example: false
 *               sector_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Colaborador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collaborator'
 *       400:
 *         description: Dados inválidos ou colaborador já existente
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */

const createCollaborator = async (req: Request, res: Response) => {
  try {
    const validation = createCollaboratorSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error._zod,
      });
    }

    const data = validation.data;

    const existingCollaborator = await db('collaborators')
      .where('registration', data.registration)
      .orWhere('email', data.email)
      .first();

    if (existingCollaborator) {
      return res.status(400).json({
        error: 'Já existe um colaborador com este registro ou email',
      });
    }

    if (Boolean(data.sector_id)) {
      const sector = await db('sectors').where({ id: data.sector_id }).first();
      if (!sector) {
        return res.status(400).json({
          error: `Sector com id ${data.sector_id} não encontrado`,
        });
      }
    }

    if (Boolean(data.user_id)) {
      const user = await db('users').where({ id: data.user_id }).first();
      if (!user) {
        return res.status(400).json({
          error: `User com id ${data.user_id} não encontrado`,
        });
      }
    }

    const [id] = await db('collaborators').insert({
        name: data.name,
        registration: data.registration,
        email: data.email,
        phone: data.phone,
        admission_date: data.admission_date,
        dismissal_date: data.dismissal_date,
        is_volunteer: data.is_volunteer,
        sector_id: data.sector_id ?? null,
        user_id: data.user_id ?? null,
        is_active: data.is_active,
      });

    const collaborator = await db('collaborators').where({ id }).first();

    return res.status(201).json(collaborator);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar colaborador' });
  }
};
export { createCollaborator };
