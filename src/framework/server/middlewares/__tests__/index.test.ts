import koa from 'koa'
import logger from '../../../../interfaces/tools/logger'
import app from '../..'
import middlewaresHandler, { MiddlewareModule } from '../index'
import middlewareConfiguration from '../config'

jest.mock('../../../../interfaces/tools/logger', (): object => ({
  info: (): void => {},
  error: (): void => {},
  debug: (): void => {},
  verbose: (): void => {},
}))

class Middleware {}
jest.mock('koa', (): object => ({
  Middleware: Middleware,
}))

jest.mock('../..', (): object => ({
  CustomApp: class CustomApp {},
  use() {},
}))

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
      type middlewareModule = Promise<{ default: Middleware }>
      const dummyMiddlewareModule: middlewareModule = new Promise((resolve): void =>
        resolve({ default: async (ctx: object, next: () => Promise<void>): Promise<void> => await next() }),
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
