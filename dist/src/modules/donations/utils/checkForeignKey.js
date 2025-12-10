"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForeignKeyExistence = void 0;
const connection_1 = require("@/database/connection");
const checkForeignKeyExistence = async (data) => {
    const donor = await (0, connection_1.db)('donors').where({ id: data.donor_id }).first();
    if (!donor)
        return { error: { status: 404, body: { error: 'Doador não encontrado' } } };
    const collaborator = await (0, connection_1.db)('collaborators')
        .where({ id: data.collaborator_id })
        .first();
    if (!collaborator)
        return {
            error: { status: 404, body: { error: 'Colaborador não encontrado' } },
        };
    let campaign = null;
    if (data.campaign_id) {
        campaign = await (0, connection_1.db)('campaigns').where({ id: data.campaign_id }).first();
        if (!campaign)
            return {
                error: { status: 404, body: { error: 'Campanha não encontrada' } },
            };
    }
    let product = null;
    if (data.product_id) {
        product = await (0, connection_1.db)('products').where({ id: data.product_id }).first();
        if (!product)
            return {
                error: { status: 404, body: { error: 'Produto não encontrado' } },
            };
    }
    return { donor, collaborator, campaign, product };
};
exports.checkForeignKeyExistence = checkForeignKeyExistence;
