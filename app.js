'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  fastify
    .register(require('fastify-knexjs'), {
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: process.env.SQLITE_FILENAME,
        ...opts.sqlite
      }
    })
    .register(require('fastify-cors'))
    .register(require('fastify-helmet'))
    .register(require('fastify-jwt'), {
      secret: process.env.JWT_SECRET,
      ...opts.jwt
    })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({ prefix: '/api' }, opts)
  })

  next()
}
