"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.alterTable('campaigns', (table) => {
        table.string('campaign_type').notNullable().defaultTo('general');
    });
}
async function down(knex) {
    return knex.schema.alterTable('campaigns', (table) => {
        table.dropColumn('campaign_type');
    });
}
