import 'koa'
import router from '../routes/router'
import '../../../interfaces/tools/config/config'
import '../../../interfaces/tools/logger'
import middlewares from '../middlewares'

jest.mock(
  'koa',
  () =>
    class KoaMock {
      public use() {
        return
      }
      public emit() {
        return
      }
      public on() {
        return
      }
      public listen() {
        return
      }
    },
)

jest.mock(
  '../routes/router',
  (): Record<string, unknown> => ({
    routes: (): string => 'routes',
  }),
)
jest.mock(
  '../../../interfaces/tools/config/config',
  (): Record<string, unknown> => ({
    get: (): string => '3000',
  }),
)
jest.mock(
  '../../../interfaces/tools/logger',
  (): Record<string, unknown> => ({
    info: (): void => {
      return
    },
    error: (): void => {
      return
    },
    debug: (): void => {
      return
    },
  }),
)
jest.mock(
  '../middlewares',
  (): Record<string, unknown> => ({
    register: (): Promise<void> => Promise.resolve(),
  }),
)
import app from '../'

describe('Server', (): void => {
  it('should have boot and init phase', async (): Promise<void> => {
    expect(app.boot).toBeDefined()
    expect(app.init).toBeDefined()
  })

  it('should boot', async (): Promise<void> => {
    jest.spyOn(middlewares, 'register')
    jest.spyOn(router, 'routes')
    jest.spyOn(app, 'use')
    jest.spyOn(app, 'emit')

    await app.boot()

    expect(middlewares.register).toHaveBeenCalledWith(app)
    expect(router.routes).toHaveBeenCalled()
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
