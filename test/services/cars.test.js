'use strict'

const { parseResponse } = require('../helper')
const { parseJSONResponse } = require('../helper')
const { test } = require('tap')
const { bootstrap } = require('../helper')

async function authenticate (app) {
  const auth = await app.inject({
    url: '/api/auth/token',
    method: 'POST',
    payload: { username: 'notproductionready', password: 'notproductionready' }
  })

  const { token } = JSON.parse(auth.payload)
  return token
}

function generateExampleCar (overrides = {}) {
  return {
    make: 'ford',
    model: 'fiesta',
    year: 1996,
    colour: 'aquamaroon',
    ...overrides
  }
}

test('test cars CRUD', async (t) => {
  t.test('should create a car', async (t) => {
    const { app } = await bootstrap(t)
    const car = generateExampleCar()
    const token = await authenticate(app)

    const { id } = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: car
    }))

    const payload = parseJSONResponse(await app.inject({
      url: `/api/cars/${id}`,
      headers: { Authorization: `Bearer ${token}` }
    }))

    const expected = { id, ...car }
    t.same(payload, expected)
  })

  t.test('should get all cars', async (t) => {
    const { app } = await bootstrap(t)
    const car1 = generateExampleCar({ model: 'focus' })
    const car2 = generateExampleCar({ model: 'mondeo' })
    const token = await authenticate(app)

    const { id: id1 } = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: car1
    }))

    const { id: id2 } = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: car2
    }))

    const payload = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` }
    }))

    const expected = [
      { id: id1, ...car1 },
      { id: id2, ...car2 }
    ]
    t.same(payload, expected)
  })

  t.test('should get all cars with pagination', async (t) => {
    const { app } = await bootstrap(t)
    const token = await authenticate(app)
    const createCars = ['focus', 'mondeo', 'fiesta', 'kia']
    for (const model of createCars) {
      const car = generateExampleCar({ model })
      parseJSONResponse(await app.inject({
        url: '/api/cars',
        headers: { Authorization: `Bearer ${token}` },
        method: 'POST',
        payload: car
      }))
    }

    const fixtures = [
      {
        query: {
          limit: 1, offset: 1
        },
        expected: [2]
      },
      {
        query: {
          limit: 2, offset: 2
        },
        expected: [3, 4]
      },
      {
        query: {
          limit: 2
        },
        expected: [1, 2]
      },
      {
        query: {
          offset: 2
        },
        expected: [3, 4]
      }
    ]
    for (const { query, expected } of fixtures) {
      const payload = parseJSONResponse(await app.inject({
        url: '/api/cars',
        headers: { Authorization: `Bearer ${token}` },
        query
      }))

      t.same(payload.map(({ id }) => id), expected)
    }
  })

  t.test('should update a car', async (t) => {
    const { app } = await bootstrap(t)
    const car1 = generateExampleCar({ model: 'focus' })
    const car2 = generateExampleCar({ model: 'mondeo' })
    const car3 = generateExampleCar({ model: 'KA' })
    const token = await authenticate(app)

    const { id: id1 } = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: car1
    }))

    const { id: id2 } = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: car2
    }))

    const putPayload = parseJSONResponse(await app.inject({
      url: `/api/cars/${id1}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'PUT',
      payload: car3
    }))

    t.same(putPayload, { id: id1, ...car3 })
    const getAllPayload = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` }
    }))

    const expected = [
      { id: id1, ...car3 },
      { id: id2, ...car2 }
    ]
    t.same(getAllPayload, expected)
  })

  t.test('should delete a car', async (t) => {
    const { app } = await bootstrap(t)
    const car1 = generateExampleCar({ model: 'focus' })
    const car2 = generateExampleCar({ model: 'mondeo' })
    const token = await authenticate(app)

    const { id: id1 } = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: car1
    }))

    const { id: id2 } = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: car2
    }))

    parseResponse(await app.inject({
      url: `/api/cars/${id1}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'DELETE'
    }), 204)

    const getAllPayload = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: `Bearer ${token}` }
    }))

    const expected = [
      { id: id2, ...car2 }
    ]
    t.same(getAllPayload, expected)
  })

  t.test('should give 404 if car does not exist', async (t) => {
    const { app } = await bootstrap(t)

    const token = await authenticate(app)

    const payload = parseJSONResponse(await app.inject({
      url: '/api/cars/123',
      headers: { Authorization: `Bearer ${token}` }
    }), 404)
    t.same(payload, { message: 'Requested car does not exist' })
  })

  t.test('should give 404 if car does not exist (delete)', async (t) => {
    const { app } = await bootstrap(t)

    const token = await authenticate(app)

    const payload = parseJSONResponse(await app.inject({
      url: '/api/cars/123',
      headers: { Authorization: `Bearer ${token}` },
      method: 'DELETE'
    }), 404)
    t.same(payload, { message: 'Requested car does not exist' })
  })

  t.test('should give 404 if car does not exist (update)', async (t) => {
    const { app } = await bootstrap(t)

    const token = await authenticate(app)

    const payload = parseJSONResponse(await app.inject({
      url: '/api/cars/123',
      headers: { Authorization: `Bearer ${token}` },
      method: 'PUT',
      payload: generateExampleCar()
    }), 404)
    t.same(payload, { message: 'Requested car does not exist' })
  })

  t.test('should give jwt token error', async (t) => {
    const { app } = await bootstrap(t)

    const payload = parseJSONResponse(await app.inject({
      url: '/api/cars',
      headers: { Authorization: 'Bearer invalid' }
    }), 401)

    t.is(payload.message, 'Authorization token is invalid: jwt malformed')
  })
})
