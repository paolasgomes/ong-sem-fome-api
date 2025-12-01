import { Request, Response } from 'express';
import { db } from '@/database/connection';
import { z } from 'zod';

const querySchema = z.object({
  tipoDoacao: z.enum(['dinheiro', 'produto']).optional(),
  from: z.string().optional(), // ISO date
  to: z.string().optional(), // ISO date
  donor_id: z.preprocess(
    (v) => (v ? Number(v) : undefined),
    z.number().int().positive().optional(),
  ),
  collaborator_id: z.preprocess(
    (v) => (v ? Number(v) : undefined),
    z.number().int().positive().optional(),
  ),
  campaign_id: z.preprocess(
    (v) => (v ? Number(v) : undefined),
    z.number().int().positive().optional(),
  ),
  product_id: z.preprocess(
    (v) => (v ? Number(v) : undefined),
    z.number().int().positive().optional(),
  ),
  page: z.preprocess(
    (v) => (v ? Number(v) : undefined),
    z.number().int().positive().optional(),
  ),
  limit: z.preprocess(
    (v) => (v ? Number(v) : undefined),
    z.number().int().positive().optional(),
  ),
});

type QueryInput = z.infer<typeof querySchema>;

/**
 * @swagger
 * /reports/donations:
 *   get:
 *     summary: Relatório geral de doações (dinheiro ou produto) com filtros
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipoDoacao
 *         schema:
 *           type: string
 *           enum: [dinheiro, produto]
 *         description: Tipo do relatório (dinheiro => soma de valores; produto => soma de quantidades)
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial (inclusive)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final (inclusive)
 *       - in: query
 *         name: donor_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: collaborator_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: campaign_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página (para listagem paginada)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Itens por página (para listagem paginada)
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *       400:
 *         description: Filtros inválidos
 *       500:
 *         description: Erro interno do servidor
 */
const donationsReport = async (req: Request, res: Response) => {
  try {
    const parse = querySchema.safeParse(req.query);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: 'Filtros inválidos', details: parse.error._zod });
    }
    const q: QueryInput = parse.data;
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;

    // helper para aplicar filtros comuns
    const applyFilters = (builder: any) => {
      if (q.from) builder.where('d.created_at', '>=', new Date(q.from));
      if (q.to) builder.where('d.created_at', '<=', new Date(q.to));
      if (q.donor_id) builder.where('d.donor_id', q.donor_id);
      if (q.collaborator_id)
        builder.where('d.collaborator_id', q.collaborator_id);
      if (q.campaign_id) builder.where('d.campaign_id', q.campaign_id);
      if (q.product_id) builder.where('d.product_id', q.product_id);
      return builder;
    };

    // default behavior: if tipoDoacao absent => return ambos (resumo separado)
    if (!q.tipoDoacao || q.tipoDoacao === 'dinheiro') {
      // dinheiro report
      const moneyBase = db('donations as d')
        .leftJoin('donors as donor', 'd.donor_id', 'donor.id')
        .leftJoin('collaborators as collab', 'd.collaborator_id', 'collab.id')
        .select(
          'd.id',
          'd.amount',
          'd.created_at',
          'd.observations',
          'donor.id as donor_id',
          'donor.name as donor_name',
          'collab.id as collaborator_id',
          'collab.name as collaborator_name',
        )
        .where('d.type', 'money');

      applyFilters(moneyBase);

      const paginated = await moneyBase.clone().paginate({
        perPage: limit,
        currentPage: page,
        isLengthAware: true,
      });

      const totalsRaw: any = await db('donations as d')
        .modify((b: any) => {
          b.where('d.type', 'money');
          applyFilters(b);
        })
        .sum({ total_amount: 'amount' })
        .first();

      const totalAmount = Number(totalsRaw?.total_amount ?? 0);

      const results = (paginated.data || []).map((row: any) => ({
        id: row.id,
        amount:
          row.amount !== null && row.amount !== undefined
            ? parseFloat(String(row.amount))
            : null,
        observations: row.observations,
        created_at: row.created_at,
        donor: row.donor_id ? { id: row.donor_id, name: row.donor_name } : null,
        collaborator: row.collaborator_id
          ? { id: row.collaborator_id, name: row.collaborator_name }
          : null,
      }));

      return res.json({
        type: 'dinheiro',
        summary: { total_amount: totalAmount },
        results,
        page: paginated.pagination.currentPage,
        limit: paginated.pagination.perPage,
        total: paginated.pagination.total,
        totalPages: paginated.pagination.lastPage || 1,
      });
    }

    if (q.tipoDoacao === 'produto') {
      // product report: consider types that are product-like
      const productTypes = ['food', 'clothing'];

      // totals across donations filtered
      const totalsRaw: any = await db('donations as d')
        .modify((b: any) => {
          b.whereIn('d.type', productTypes);
          applyFilters(b);
        })
        .sum({ total_quantity: 'quantity' })
        .first();
      const totalQuantity = Number(totalsRaw?.total_quantity ?? 0);

      // per-product totals
      const perProduct = await db('donations as d')
        .leftJoin('products as p', 'd.product_id', 'p.id')
        .modify((b: any) => {
          b.whereIn('d.type', productTypes);
          applyFilters(b);
        })
        .groupBy('p.id', 'p.name')
        .select('p.id as product_id', 'p.name as product_name')
        .sum({ total_quantity: 'd.quantity' })
        .orderBy('total_quantity', 'desc');

      // list donations paginated (product donations)
      const base = db('donations as d')
        .leftJoin('products as p', 'd.product_id', 'p.id')
        .leftJoin('donors as donor', 'd.donor_id', 'donor.id')
        .leftJoin('collaborators as collab', 'd.collaborator_id', 'collab.id')
        .select(
          'd.id',
          'd.quantity',
          'd.created_at',
          'd.observations',
          'p.id as product_id',
          'p.name as product_name',
          'donor.id as donor_id',
          'donor.name as donor_name',
          'collab.id as collaborator_id',
          'collab.name as collaborator_name',
        )
        .whereIn('d.type', productTypes);

      applyFilters(base);

      const paginated = await base.clone().paginate({
        perPage: limit,
        currentPage: page,
        isLengthAware: true,
      });

      const results = (paginated.data || []).map((row: any) => ({
        id: row.id,
        quantity:
          row.quantity !== null && row.quantity !== undefined
            ? Number(row.quantity)
            : null,
        observations: row.observations,
        created_at: row.created_at,
        product: row.product_id
          ? { id: row.product_id, name: row.product_name }
          : null,
        donor: row.donor_id ? { id: row.donor_id, name: row.donor_name } : null,
        collaborator: row.collaborator_id
          ? { id: row.collaborator_id, name: row.collaborator_name }
          : null,
      }));

      return res.json({
        type: 'produto',
        summary: { total_quantity: totalQuantity },
        per_product: perProduct.map((p: any) => ({
          product_id: p.product_id,
          product_name: p.product_name,
          total_quantity: Number(p.total_quantity ?? 0),
        })),
        results,
        page: paginated.pagination.currentPage,
        limit: paginated.pagination.perPage,
        total: paginated.pagination.total,
        totalPages: paginated.pagination.lastPage || 1,
      });
    }

    return res.status(400).json({ error: 'tipoDoacao inválido' });
  } catch (err: any) {
    console.error('Erro ao gerar relatório de doações', err);
    return res
      .status(500)
      .json({
        error: 'Erro ao gerar relatório de doações',
        details: err?.message,
      });
  }
};

export { donationsReport };
