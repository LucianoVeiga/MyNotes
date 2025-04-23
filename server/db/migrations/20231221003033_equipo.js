/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
    return knex.schema.table("teams", (table) => {
      table.string("id").notNullable();
      table.string("name").notNullable();
      table.string("color").notNullable();
      table.boolean("qualified").notNullable();
	  table.specificType("badge", "png").nullable();
      table.timestamps(true, true);
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("teams");
  };
