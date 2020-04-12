import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../interfaces/tools/logger'
import notFoundHandler from '../not-found/index'
import { NotFoundError } from '../../../../interfaces/tools/errors'

describe('NotFoundHandler Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  it('should return 404 error', async (done): Promise<void> => {
    const mockedContext = createMockContext({
      url: '/unexisting-url',
      method: 'GET',
    })

    try {
      await notFoundHandler(mockedContext, jest.fn())
    } catch (error) {
      expect(mockedContext.status).toEqual(404)
      expect(error).toBeInstanceOf(NotFoundError)
      done()
    }
  })
})
