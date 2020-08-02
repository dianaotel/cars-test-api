// Note: fastify implicitly runs dotenv, so we only need to explicitly do it here because
// knex cli doesn't implicitly run it (only knex cli needs this file).
require('dotenv').config()

module.exports = {
  // being explicit about envs because we specifically don't want test env to pull
  // from env var (we generate the db files in tests)

  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: process.env.SQLITE_FILENAME
    }
  },

  production: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: process.env.SQLITE_FILENAME
    }
  }

}
