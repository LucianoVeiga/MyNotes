require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: "./db/migrations",
    }
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: "./db/migrations",
    }
  }
};