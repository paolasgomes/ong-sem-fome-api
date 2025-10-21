import { Request, Response } from 'express';
import { db } from '../../../database/connection';
import { createFamilySchema } from '../schemas/create';

const createFamily = async (req: Request, res: Response) => {
  try {
    const validation = createFamilySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error,
      });
    }

    const data = validation.data;

    const existingFamily = await db('families')
      .where('responsible_cpf', data.responsible_cpf)
      .orWhere('email', data.email)
      .first();

    if (existingFamily) {
      return res.status(400).json({
        error: 'Já existe uma família com este CPF ou email',
      });
    }

    const [id] = await db('families').insert({
      responsible_name: data.responsible_name,
      responsible_cpf: data.responsible_cpf,
      street_number: data.street_number,
      street_complement: data.street_complement,
      street_neighborhood: data.street_neighborhood,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      street_address: data.street_address,
      phone: data.phone,
      email: data.email,
      members_count: data.members_count,
      income_bracket: data.income_bracket,
      address: data.address,
      observation: data.observation,
      is_active: data.is_active,
      has_social_programs: data.has_social_programs,
      social_program_id: data.social_program_id ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const family = await db('families').where({ id }).first();
    return res.status(201).json(family);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar família' });
  }
};
export { createFamily };
