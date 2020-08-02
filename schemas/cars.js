'use strict'

const carMutationProperties = {
  make: { type: 'string' },
  model: { type: 'string' },
  colour: { type: 'string' },
  year: { type: 'integer' }
}

const carResponseProperties = {
  id: { type: 'string' },
  ...carMutationProperties
}

const findAll = {
  response: {
    200: {
      type: 'array',
      items: {
        properties: carResponseProperties
      }
    }
  },
  querystring: {
    limit: { type: 'integer' },
    offset: { type: 'integer' }
  }
}

const findOne = {
  response: {
    200: {
      type: 'object',
      properties: carResponseProperties
    },
    404: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer' }
    }
  }
}

const insertOne = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: Object.keys(carMutationProperties),
    properties: carMutationProperties
  }
}

const updateOne = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: Object.keys(carMutationProperties),
    properties: carMutationProperties
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer' }
    }
  }
}

const deleteOne = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer' }
    }
  }
}

module.exports = { findAll, findOne, insertOne, updateOne, deleteOne }
