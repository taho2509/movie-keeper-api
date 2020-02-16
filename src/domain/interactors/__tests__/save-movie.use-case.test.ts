/* eslint-disable @typescript-eslint/explicit-function-return-type */
import SaveMovieUseCase from '../save-movie.use-case'
import Interactor from '../interactor'

describe('SaveMovieUseCase', () => {
  let saveMovieUseCase: SaveMovieUseCase = null
  const validateMock = jest.fn()
  const notifyMock = jest.fn()

  beforeEach(() => {
    validateMock.mockReset()
    notifyMock.mockReset()
    saveMovieUseCase = new SaveMovieUseCase(
      {
        validate: validateMock,
      },
      {
        notify: notifyMock,
      },
    )
  })

  it('should instantiate a SaveMovieUseCase', () => {
    expect(saveMovieUseCase).toBeInstanceOf(SaveMovieUseCase)
  })

  it('should implements Interactor Interface', () => {
    const usecase = saveMovieUseCase as Interactor
    expect(usecase.execute).toBeDefined()
  })

  it('should use provider to validate data', async () => {
    const movie = {}
    await saveMovieUseCase.execute(movie)
    expect(validateMock).toBeCalled()
    expect(validateMock).toHaveBeenCalledWith(movie)
  })

  it('should use provider to when validate success publish data', async () => {
    const movie = {}
    validateMock.mockImplementation(() => true)
    await saveMovieUseCase.execute(movie)
    expect(notifyMock).toBeCalled()
    expect(notifyMock).toHaveBeenCalledWith(movie)
  })

  it('should return false when validation fails', async () => {
    const movie = {}
    validateMock.mockImplementation(() => false)
    const result = await saveMovieUseCase.execute(movie)

    expect(result).toStrictEqual({ body: false })
  })

  it('should not notify when validation fails', async () => {
    const movie = {}
    validateMock.mockImplementation(() => false)
    await saveMovieUseCase.execute(movie)

    expect(notifyMock).not.toHaveBeenCalled()
  })

  it('should return true', async () => {
    const movie = {}
    validateMock.mockImplementation(() => true)
    const result = await saveMovieUseCase.execute(movie)

    expect(result).toStrictEqual({ body: true })
  })
})
