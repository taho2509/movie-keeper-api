import { createMockContext } from '@shopify/jest-koa-mocks'
import responseTimeMiddleware from '../response-time/index'

describe('ResponseTime Middeware', (): void => {
  const RealDate = Date.now

  beforeAll((): void => {
    global.Date.now = jest
      .fn()
      .mockReturnValueOnce(new Date('2020-01-01T10:20:30Z').getTime())
      .mockReturnValueOnce(new Date('2020-01-01T10:20:31Z').getTime())
  })

  afterAll((): void => {
    global.Date.now = RealDate
  })

  it('should set x-response-time header on response after call', async (): Promise<void> => {
    const mockedContext = createMockContext()

    let longExecution = new Promise<void>((res): void => res())

    await responseTimeMiddleware(mockedContext, (): Promise<void> => longExecution)

    expect(mockedContext.response.header).toHaveProperty('x-response-time')
    expect(mockedContext.response.header['x-response-time']).toBe('1000ms')
  })
})
