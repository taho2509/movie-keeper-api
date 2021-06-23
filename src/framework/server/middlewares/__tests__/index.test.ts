import 'koa'
import '../../../../interfaces/tools/logger'
import app from '../..'
import middlewaresHandler, { MiddlewareModule } from '../index'
import middlewareConfiguration from '../config'

jest.mock(
  '../../../../interfaces/tools/logger',
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
    verbose: (): void => {
      return
    },
  }),
)

class MiddlewareMock {}
jest.mock(
  'koa',
  (): Record<string, unknown> => ({
    Middleware: class MiddlewareMock {},
  }),
)

jest.mock(
  '../..',
  (): Record<string, unknown> => ({
    CustomApp: class CustomApp {},
    use() {
      return
    },
  }),
)

describe('ErrorsHandler Middleware', (): void => {
  describe('__getAllActiveMiddlewares inner function test', (): void => {
    it('should get no active middleware if we pass empty configuration', (): void => {
      const activeMiddlewareModules = middlewaresHandler.__getAllActiveMiddlewares({})
      expect(activeMiddlewareModules).toHaveLength(0)
    })

    it('should match all active modules declared on order_configuration file', (): void => {
      const activeMiddlewareModules = middlewaresHandler.__getAllActiveMiddlewares(middlewareConfiguration)
      expect(activeMiddlewareModules.length).toEqual(Object.keys(middlewareConfiguration).length)
      Object.keys(middlewareConfiguration).forEach((element, i): void => {
        expect(activeMiddlewareModules[i].name).toEqual(element)
      })
    })
  })

  describe('register', (): void => {
    it('should not load any module when no active middleware is set', async (done): Promise<void> => {
      jest.spyOn(middlewaresHandler, '__getAllActiveMiddlewares').mockImplementation((): [] => [])
      const useSpy = jest.spyOn(app, 'use')

      try {
        await middlewaresHandler.register(app)
        expect(useSpy).not.toBeCalled()
        done()
      } catch (error) {
        done.fail(error)
      }
    })

    it('should load all active middleware modules discovered', async (done): Promise<void> => {
      type middlewareModule = Promise<{ default: MiddlewareMock }>
      const dummyMiddlewareModule: middlewareModule = new Promise((resolve): void =>
        resolve({
          default: async (ctx: Record<string, unknown>, next: () => Promise<void>): Promise<void> => await next(),
        }),
      )
      jest.spyOn(middlewaresHandler, '__getAllActiveMiddlewares').mockImplementation(() => [
        {
          name: 'module1',
          middlewareModule: dummyMiddlewareModule,
        } as unknown as MiddlewareModule,
        {
          name: 'module2',
          middlewareModule: dummyMiddlewareModule,
        } as unknown as MiddlewareModule,
      ])
      const useSpy = jest.spyOn(app, 'use')

      try {
        await middlewaresHandler.register(app)
        expect(useSpy).toBeCalledTimes(2)
        done()
      } catch (error) {
        done.fail(error)
      }
    })
  })
})
