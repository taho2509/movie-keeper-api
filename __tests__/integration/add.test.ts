process.env.NODE_ENV = 'test'
process.env.PORT = '3002'
process.env.LOG_LEVEL = 'info'
process.env.NATS_URL = ''

import supertest from 'supertest'
import '../../src/index'
import app from '../../src/framework/server'

describe('Add', () => {
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
      .post('/v1.0.0/add')
      .send({
        title: 'Endgame',
      })
      .expect(200)
      .then(({ body }) => {
        expect(body).toBe(true)
      })
  })
})
