/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("teams", (table) => {
	  table.binary("badge", 4000000).nullable();
	  table.string("badgeType").nullable();
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.alterTable('teams', table => {
		table.dropColumn('badge');
	})
};
