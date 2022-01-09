process.env.NODE_ENV = 'test'
process.env.PORT = '3000'
process.env.LOG_LEVEL = 'info'
process.env.OMDB_API_KEY = ''
process.env.NATS_URL = ''

import supertest from 'supertest'
import '../../src/index'
import app from '../../src/framework/server'

describe('The api should be healthy', () => {
  beforeAll(() => {
    return new Promise<void>((resolve) => {
      app.on('application:started', () => resolve())
    })
  })

  afterAll(async () => {
    await app.stop()
  })

  it('should get ok', async () => {
    await supertest(app.server)
      .get('/v1.0.0/health')
      .expect(200)
      .then(({ body }) => {
        expect(body).toStrictEqual({
          message: 'The API is healthy',
        })
      })
  })
})
