import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../interfaces/tools/logger'
import correlationalIdMiddleware from '../correlational-id'

jest.mock('uuid', () => {
  return {
    v4: () => '5678',
  }
})
describe('Correlational Id Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  it('should set x-correlational-id header on response after call', async (): Promise<void> => {
    const mockedContext = createMockContext({
      headers: {
        'X-Correlational-Id': '1234',
      },
    })
    jest.spyOn(mockedContext, 'set')

    await correlationalIdMiddleware(mockedContext, jest.fn())

    expect(mockedContext.set).toBeCalledWith('X-Correlational-Id', '1234')
  })

  it('should generate x-correlational-id header on response after call', async (): Promise<void> => {
    const mockedContext = createMockContext({
      headers: {},
    })
    jest.spyOn(mockedContext, 'set')

    await correlationalIdMiddleware(mockedContext, jest.fn())

    expect(mockedContext.set).toBeCalledWith('X-Correlational-Id', '5678')
  })
})
