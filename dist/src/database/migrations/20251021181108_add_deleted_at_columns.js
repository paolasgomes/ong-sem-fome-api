"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    const tables = ['families', 'donors', 'users'];
    for (const tableName of tables) {
        await knex.schema.alterTable(tableName, (table) => {
            table.timestamp('deleted_at').nullable();
        });
    }
}
async function down(knex) {
    const tables = ['families', 'donors', 'users'];
    for (const tableName of tables) {
        await knex.schema.alterTable(tableName, (table) => {
            table.dropColumn('deleted_at');
        });
    }
}
