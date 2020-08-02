'use strict'

const schemas = require('../schemas/cars')

module.exports = async function (fastify, opts) {
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.setNotFoundHandler(function (request, reply) {
    reply
      .code(404)
      .type('application/json')
      .send({ message: 'Requested car does not exist' })
  })

  fastify.get(
    '/',
    { schema: schemas.findAll },
    function (request, reply) {
      const limit = Number(request.query.limit)
      const offset = Number(request.query.offset)

      // todo all exception messages are passed to frontend...
      const query = this.knex('cars')
        .offset(offset)
      if (limit) {
        query.limit(limit)
      }
      if (offset) {
        query.offset(offset)
      }
      return query
    }
  )

  fastify.get(
    '/:id',
    { schema: schemas.findOne },
    async function (request, reply) {
      const item = await this.knex('cars').where({ id: request.params.id }).first()

      if (item == null) {
        return reply.callNotFound()
      }

      return item
    }
  )

  fastify.post(
    '/',
    { schema: schemas.insertOne },
    async function (request, reply) {
      const [id] = await this.knex('cars').insert(
        request.body
      )
      return { id, ...request.body }
    }
  )

  fastify.put(
    '/:id',
    { schema: schemas.updateOne },
    async function (request, reply) {
      const { id } = request.params
      const item = await this.knex('cars').where({ id }).first()

      if (item == null) {
        return reply.callNotFound()
      }

      await this.knex('cars')
        .where({ id })
        .update(request.body)

      return { ...request.body, id }
    }
  )

  fastify.delete(
    '/:id',
    { schema: schemas.deleteOne },
    async function (request, reply) {
      const { id } = request.params

      const item = await this.knex('cars').where({ id }).first()

      if (item == null) {
        return reply.callNotFound()
      }

      await this.knex('cars')
        .where({ id: request.params.id })
        .del()
      reply.status(204)
    }
  )
}

module.exports.autoPrefix = '/cars'
