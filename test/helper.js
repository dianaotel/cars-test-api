'use strict'

const os = require('os')
const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')
const Knex = require('knex')
const assert = require('assert')

const generateId = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9)
}

function config (filename) {
  return {
    jwt: {
      secret: 'averyverylongsecret'
    },
    sqlite: {
      filename
    }
  }
}

function bootstrapApp (dbFilename) {
  const app = Fastify({ logger: true })

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config(dbFilename))

  return app
}

async function bootstrapDb (database) {
  const dbFilename = `${os.tmpdir()}/${database}`
  const knex = Knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: dbFilename
    }
  })
  await knex.migrate.latest()
  await knex.seed.run()
  await knex.destroy()

  return { dbFilename }
}

export async function bootstrap (t) {
  const dbName = generateId()
  const { dbFilename } = await bootstrapDb(dbName)
  const app = bootstrapApp(dbFilename)
  t.tearDown(async () => {
    await app.close()
  })

  return { app }
}

export const parseResponse = (res, code = 200, contentTypePattern = null) => {
  try {
    assert.strictEqual(res.statusCode, code)
    if (contentTypePattern) {
      assert.match(res.headers['content-type'], contentTypePattern)
    }
    return res.payload
  } catch (e) {
    const msg =
      `Error in response to ${res.raw.req.method} ${res.raw.req.url}, response code: ${res.statusCode}: ` +
      `response payload: ${res.payload}, content-type: ${res.headers['content-type']}, error: ${e.message}`
    throw new Error(msg)
  }
}
export const parseJSONResponse = (res, code = 200) => {
  return JSON.parse(parseResponse(res, code, /application\/json/))
}

module.exports = { bootstrap, parseResponse, parseJSONResponse }
