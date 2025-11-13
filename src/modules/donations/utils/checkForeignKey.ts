import { db } from '@/database/connection';
import { CreateDonationInput } from '../schemas/create';

const checkForeignKeyExistence = async (data: CreateDonationInput) => {
  const donor = await db('donors').where({ id: data.donor_id }).first();
  if (!donor)
    return { error: { status: 404, body: { error: 'Doador não encontrado' } } };

  const collaborator = await db('collaborators')
    .where({ id: data.collaborator_id })
    .first();
  if (!collaborator)
    return {
      error: { status: 404, body: { error: 'Colaborador não encontrado' } },
    };

  let campaign = null;
  if (data.campaign_id) {
    campaign = await db('campaigns').where({ id: data.campaign_id }).first();
    if (!campaign)
      return {
        error: { status: 404, body: { error: 'Campanha não encontrada' } },
      };
  }

  let product = null;
  if (data.product_id) {
    product = await db('products').where({ id: data.product_id }).first();
    if (!product)
      return {
        error: { status: 404, body: { error: 'Produto não encontrado' } },
      };
  }

  return { donor, collaborator, campaign, product };
};

export { checkForeignKeyExistence };
