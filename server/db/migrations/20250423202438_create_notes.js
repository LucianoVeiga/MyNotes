/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
	return knex.schema.createTable("notes", (table) => {
	  table.increments("id");
	  table.string("title").nullable();
	  table.text("content").nullable();
	  table.integer('user_id').unsigned().notNullable();
	  table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
	});
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  
  exports.down = function (knex) {
	return knex.schema.dropTableIfExists("notes");
  };
  