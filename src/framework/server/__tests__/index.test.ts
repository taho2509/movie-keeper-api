import Koa from 'koa'
import router from '../routes/router'
import config from '../../../interfaces/tools/config/config'
import logger from '../../../interfaces/tools/logger'
import middlewaresHandler from '../middlewares'

class KoaMock {
  public use() {}
  public emit() {}
  public on() {}
  public listen() {}
}
jest.mock('koa', (): typeof KoaMock => KoaMock)
const routerMock = {
  routes: (): string => 'routes',
}
jest.mock('../routes/router', (): object => routerMock)
jest.mock('../../../interfaces/tools/config/config', (): object => ({
  get: (): string => '3000',
}))
jest.mock('../../../interfaces/tools/logger', (): object => ({
  info: (): void => {},
  error: (): void => {},
  debug: (): void => {},
}))
const mockMiddlewares = {
  register: (): Promise<void> => Promise.resolve(),
}
jest.mock('../middlewares', (): object => mockMiddlewares)
import app from '../'

describe('Server', (): void => {
  it('should have boot and init phase', async (): Promise<void> => {
    expect(app.boot).toBeDefined()
    expect(app.init).toBeDefined()
  })

  it('should boot', async (): Promise<void> => {
    jest.spyOn(mockMiddlewares, 'register')
    jest.spyOn(routerMock, 'routes')
    jest.spyOn(app, 'use')
    jest.spyOn(app, 'emit')

    await app.boot()

    expect(mockMiddlewares.register).toHaveBeenCalledWith(app)
    expect(routerMock.routes).toHaveBeenCalled()
    expect(app.use).toHaveBeenCalledWith('routes')
    expect(app.emit).toHaveBeenCalledWith('application:booted')
  })

  it('should init', async (): Promise<void> => {
    jest.spyOn(app, 'listen')
    jest.spyOn(app, 'emit')

    await app.init()

    expect(app.listen).toHaveBeenCalledWith(3000)
    expect(app.emit).toHaveBeenCalledWith('application:started')
  })
})
