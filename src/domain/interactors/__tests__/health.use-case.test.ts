import HealthUseCase from '../health.use-case'

describe('Health use case', (): void => {
  let healthInteractor: HealthUseCase = null

  beforeEach((): void => {
    healthInteractor = new HealthUseCase()
  })

  it('should works', async (): Promise<void> => {
    const response = await healthInteractor.execute()
    expect(response.body).toStrictEqual({ message: 'The API is healthy' })
  })
})
