require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

console.log("ASD" + process.env.DATABASE_URI)

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: "./db/migrations",
    }
  }
};