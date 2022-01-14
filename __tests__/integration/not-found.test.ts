process.env.NODE_ENV = 'test'
process.env.PORT = '3003'
process.env.LOG_LEVEL = 'info'
process.env.NATS_URL = ''

import supertest from 'supertest'
import '../../src/index'
import app from '../../src/framework/server'

describe('Not found', () => {
  beforeAll(() => {
    return new Promise<void>((resolve) => {
      app.on('application:started', async () => {
        resolve()
      })
    })
  })

  afterAll(async () => {
    await app.stop()
  })

  it('should add movie', async () => {
    await supertest(app.server)
      .get('/v1.0.0/searc')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Route /v1.0.0/searc Not Found')
      })
  })
})
