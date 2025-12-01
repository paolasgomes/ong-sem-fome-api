import { db } from '@/database/connection';
import { Request, Response } from 'express';

interface CountRow {
  total: string | number;
}

interface TypeRow {
  campaign_type: string;
  total: string | number;
  total_goal_quantity: string | number | null;
  total_goal_amount: string | number | null;
}

const getCampaignsReport = async (req: Request, res: Response) => {
  try {
    const { name, created_from, created_to, campaign_type } = req.query;

    const query = db('campaigns');

    if (typeof name === 'string' && name.trim()) {
      query.whereILike('name', `%${name.trim()}%`);
    }

    if (typeof created_from === 'string') {
      query.where('start_date', '>=', created_from);
    }

    if (typeof created_to === 'string') {
      query.where('start_date', '<=', created_to);
    }

    const hasCampaignTypeFilter =
      typeof campaign_type === 'string' && campaign_type.trim();

    if (hasCampaignTypeFilter) {
      query.where('campaign_type', campaign_type);
    }

    const [total, active, inactive] = await Promise.all([
      query.clone().count<CountRow[]>('* as total').first(),
      query
        .clone()
        .where('is_active', 1)
        .count<CountRow[]>('* as total')
        .first(),
      query
        .clone()
        .where('is_active', 0)
        .count<CountRow[]>('* as total')
        .first(),
    ]);

    const byTypeQuery = db('campaigns');

    if (typeof name === 'string' && name.trim()) {
      byTypeQuery.whereILike('name', `%${name.trim()}%`);
    }

    if (typeof created_from === 'string') {
      byTypeQuery.where('start_date', '>=', created_from);
    }

    if (typeof created_to === 'string') {
      byTypeQuery.where('start_date', '<=', created_to);
    }

    if (hasCampaignTypeFilter) {
      byTypeQuery.where('campaign_type', campaign_type);
    }

    const byTypeRaw = (await byTypeQuery
      .select('campaign_type')
      .count('* as total')
      .sum('goal_quantity as total_goal_quantity')
      .sum('goal_amount as total_goal_amount')
      .groupBy('campaign_type')) as TypeRow[];

    const byType = byTypeRaw.map((row) => ({
      campaign_type: row.campaign_type,
      total: Number(row.total),
      total_goal_quantity: Number(row.total_goal_quantity ?? 0),
      total_goal_amount: Number(row.total_goal_amount ?? 0),
    }));

    return res.json({
      filters: {
        name: name || null,
        created_from: created_from || null,
        created_to: created_to || null,
        campaign_type: campaign_type || null,
      },
      summary: {
        total_campaigns: Number(total?.total ?? 0),
        active_campaigns: Number(active?.total ?? 0),
        inactive_campaigns: Number(inactive?.total ?? 0),
      },
      by_type: byType,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Erro ao gerar relatório de campanhas' });
  }
};

export { getCampaignsReport };
