"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollaboratorsReport = void 0;
const connection_1 = require("@/database/connection");
/**
 * @swagger
 * /reports/collaborators:
 *   get:
 *     summary: Relatório de colaboradores
 *     tags: [Collaborators]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtro por nome do colaborador (busca parcial)
 *       - in: query
 *         name: registration
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtro por matrícula do colaborador
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtro por email do colaborador
 *       - in: query
 *         name: sector_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID do setor
 *       - in: query
 *         name: is_active
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filtrar por colaboradores ativos/inativos
 *       - in: query
 *         name: is_volunteer
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filtrar por colaboradores voluntários ou não
 *       - in: query
 *         name: admission_from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de admissão inicial (YYYY-MM-DD)
 *       - in: query
 *         name: admission_to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de admissão final (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Relatório de colaboradores gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filters:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       nullable: true
 *                     registration:
 *                       type: string
 *                       nullable: true
 *                     email:
 *                       type: string
 *                       nullable: true
 *                     sector_id:
 *                       type: integer
 *                       nullable: true
 *                     is_active:
 *                       type: boolean
 *                       nullable: true
 *                     is_volunteer:
 *                       type: boolean
 *                       nullable: true
 *                     admission_from:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     admission_to:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total_collaborators:
 *                       type: integer
 *                     active_collaborators:
 *                       type: integer
 *                     inactive_collaborators:
 *                       type: integer
 *                     volunteers:
 *                       type: integer
 *                     non_volunteers:
 *                       type: integer
 *                 by_sector:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sector_id:
 *                         type: integer
 *                         nullable: true
 *                       sector_name:
 *                         type: string
 *                         nullable: true
 *                       total:
 *                         type: integer
 *                       active:
 *                         type: integer
 *                       volunteers:
 *                         type: integer
 *                 collaborators:
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
 *                         nullable: true
 *                       dismissal_date:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       is_volunteer:
 *                         type: boolean
 *                       sector_id:
 *                         type: integer
 *                         nullable: true
 *                       sector_name:
 *                         type: string
 *                         nullable: true
 *                       user_id:
 *                         type: integer
 *                         nullable: true
 *                       is_active:
 *                         type: boolean
 *       500:
 *         description: Erro interno do servidor
 */
const getCollaboratorsReport = async (req, res) => {
    try {
        const { name, registration, email, sector_id, is_active, is_volunteer, admission_from, admission_to, } = req.query;
        const query = (0, connection_1.db)('collaborators')
            .leftJoin('sectors', 'collaborators.sector_id', 'sectors.id')
            .select('collaborators.id', 'collaborators.name', 'collaborators.registration', 'collaborators.email', 'collaborators.phone', 'collaborators.admission_date', 'collaborators.dismissal_date', 'collaborators.is_volunteer', 'collaborators.sector_id', 'collaborators.user_id', 'collaborators.is_active', 'sectors.name as sector_name');
        if (typeof name === 'string' && name.trim()) {
            query.whereILike('collaborators.name', `%${name.trim()}%`);
        }
        if (typeof registration === 'string' && registration.trim()) {
            query.where('collaborators.registration', registration.trim());
        }
        if (typeof email === 'string' && email.trim()) {
            query.whereILike('collaborators.email', `%${email.trim()}%`);
        }
        if (typeof sector_id === 'string' && !isNaN(Number(sector_id))) {
            query.where('collaborators.sector_id', Number(sector_id));
        }
        if (typeof is_active === 'string') {
            const normalized = is_active.toLowerCase();
            if (normalized === 'true' || normalized === 'false') {
                const activeFlag = normalized === 'true' ? 1 : 0;
                query.where('collaborators.is_active', activeFlag);
            }
        }
        if (typeof is_volunteer === 'string') {
            const normalized = is_volunteer.toLowerCase();
            if (normalized === 'true' || normalized === 'false') {
                const volunteerFlag = normalized === 'true' ? 1 : 0;
                query.where('collaborators.is_volunteer', volunteerFlag);
            }
        }
        if (typeof admission_from === 'string') {
            query.where('collaborators.admission_date', '>=', admission_from);
        }
        if (typeof admission_to === 'string') {
            query.where('collaborators.admission_date', '<=', admission_to);
        }
        const rows = await query;
        const collaborators = rows.map((c) => ({
            id: c.id,
            name: c.name,
            registration: c.registration,
            email: c.email,
            phone: c.phone,
            admission_date: c.admission_date,
            dismissal_date: c.dismissal_date,
            is_volunteer: Boolean(c.is_volunteer),
            sector_id: c.sector_id,
            sector_name: c.sector_name,
            user_id: c.user_id,
            is_active: Boolean(c.is_active),
        }));
        const totalCollaborators = collaborators.length;
        const activeCollaborators = collaborators.filter((c) => c.is_active).length;
        const inactiveCollaborators = totalCollaborators - activeCollaborators;
        const volunteers = collaborators.filter((c) => c.is_volunteer).length;
        const nonVolunteers = totalCollaborators - volunteers;
        const sectorMap = new Map();
        for (const c of collaborators) {
            const key = c.sector_id ?? null;
            const current = sectorMap.get(key) ?? {
                sector_id: c.sector_id ?? null,
                sector_name: c.sector_name ?? null,
                total: 0,
                active: 0,
                volunteers: 0,
            };
            current.total += 1;
            if (c.is_active)
                current.active += 1;
            if (c.is_volunteer)
                current.volunteers += 1;
            sectorMap.set(key, current);
        }
        const bySector = Array.from(sectorMap.values());
        return res.status(200).json({
            filters: {
                name: typeof name === 'string' ? name : null,
                registration: typeof registration === 'string' ? registration : null,
                email: typeof email === 'string' ? email : null,
                sector_id: typeof sector_id === 'string' && !isNaN(Number(sector_id))
                    ? Number(sector_id)
                    : null,
                is_active: typeof is_active === 'string'
                    ? ['true', 'false'].includes(is_active.toLowerCase())
                        ? is_active.toLowerCase() === 'true'
                        : null
                    : null,
                is_volunteer: typeof is_volunteer === 'string'
                    ? ['true', 'false'].includes(is_volunteer.toLowerCase())
                        ? is_volunteer.toLowerCase() === 'true'
                        : null
                    : null,
                admission_from: typeof admission_from === 'string' ? admission_from : null,
                admission_to: typeof admission_to === 'string' ? admission_to : null,
            },
            summary: {
                total_collaborators: totalCollaborators,
                active_collaborators: activeCollaborators,
                inactive_collaborators: inactiveCollaborators,
                volunteers,
                non_volunteers: nonVolunteers,
            },
            by_sector: bySector,
            collaborators,
        });
    }
    catch (error) {
        console.error('Erro ao gerar relatório de colaboradores:', error);
        const message = error instanceof Error
            ? error.message
            : 'Erro inesperado ao gerar relatório de colaboradores';
        return res.status(500).json({
            error: 'Erro ao gerar relatório de colaboradores',
            details: message,
        });
    }
};
exports.getCollaboratorsReport = getCollaboratorsReport;
