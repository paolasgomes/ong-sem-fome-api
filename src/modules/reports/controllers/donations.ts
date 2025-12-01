import { db } from '@/database/connection';
import { Request, Response } from 'express';

interface SummaryRow {
  total: string | number;
  total_amount: string | number | null;
  total_quantity: string | number | null;
}

interface TypeRow {
  type: string;
  total: string | number;
  total_amount: string | number | null;
  total_quantity: string | number | null;
}

const getDonationsReport = async (req: Request, res: Response) => {
  try {
    const {
      type,
      donor_id,
      campaign_id,
      collaborator_id,
      product_id,
      created_from,
      created_to,
    } = req.query;

    const baseQuery = db('donations');

    if (typeof type === 'string' && type.trim()) {
      baseQuery.where('type', type.trim());
    }

    if (typeof donor_id === 'string' && !isNaN(Number(donor_id))) {
      baseQuery.where('donor_id', Number(donor_id));
    }

    if (typeof campaign_id === 'string' && !isNaN(Number(campaign_id))) {
      baseQuery.where('campaign_id', Number(campaign_id));
    }

    if (
      typeof collaborator_id === 'string' &&
      !isNaN(Number(collaborator_id))
    ) {
      baseQuery.where('collaborator_id', Number(collaborator_id));
    }

    if (typeof product_id === 'string' && !isNaN(Number(product_id))) {
      baseQuery.where('product_id', Number(product_id));
    }

    if (typeof created_from === 'string') {
      baseQuery.where('created_at', '>=', created_from);
    }

    if (typeof created_to === 'string') {
      baseQuery.where('created_at', '<=', created_to);
    }

    const summaryRow = (await baseQuery
      .clone()
      .select<SummaryRow[]>([
        db.raw('COUNT(*) as total'),
        db.raw('SUM(amount) as total_amount'),
        db.raw('SUM(quantity) as total_quantity'),
      ])
      .first()) ?? {
      total: 0,
      total_amount: 0,
      total_quantity: 0,
    };

    const totalDonations = Number(summaryRow.total) || 0;
    const totalAmount = Number(summaryRow.total_amount ?? 0);
    const totalQuantity = Number(summaryRow.total_quantity ?? 0);

    const byTypeRaw = (await baseQuery
      .clone()
      .select('type')
      .count('* as total')
      .sum('amount as total_amount')
      .sum('quantity as total_quantity')
      .groupBy('type')) as TypeRow[];

    const byType = byTypeRaw.map((row) => ({
      type: row.type,
      total: Number(row.total) || 0,
      total_amount: Number(row.total_amount ?? 0),
      total_quantity: Number(row.total_quantity ?? 0),
    }));

    return res.json({
      filters: {
        type: typeof type === 'string' ? type : null,
        donor_id: typeof donor_id === 'string' ? Number(donor_id) : null,
        campaign_id:
          typeof campaign_id === 'string' ? Number(campaign_id) : null,
        collaborator_id:
          typeof collaborator_id === 'string' ? Number(collaborator_id) : null,
        product_id: typeof product_id === 'string' ? Number(product_id) : null,
        created_from: typeof created_from === 'string' ? created_from : null,
        created_to: typeof created_to === 'string' ? created_to : null,
      },
      summary: {
        total_donations: totalDonations,
        total_amount: totalAmount,
        total_quantity: totalQuantity,
      },
      by_type: byType,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Erro ao gerar relatório de doações' });
  }
};

export { getDonationsReport };
