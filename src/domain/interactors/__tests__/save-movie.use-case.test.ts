/* eslint-disable @typescript-eslint/explicit-function-return-type */
import SaveMovieUseCase from '../save-movie.use-case'
import Interactor from '../interactor'
import Movie from '../../entities/movie'

describe('SaveMovieUseCase', () => {
  let saveMovieUseCase: SaveMovieUseCase = null
  const notifyMock = jest.fn()

  beforeEach(() => {
    notifyMock.mockReset()
    saveMovieUseCase = new SaveMovieUseCase({
      notify: notifyMock,
    })
  })

  it('should instantiate a SaveMovieUseCase', () => {
    expect(saveMovieUseCase).toBeInstanceOf(SaveMovieUseCase)
  })

  it('should implements Interactor Interface', () => {
    const usecase = saveMovieUseCase as Interactor
    expect(usecase.execute).toBeDefined()
  })

  it('should notify', async () => {
    const movie = ({} as unknown) as Movie
    await saveMovieUseCase.execute(movie)
    expect(notifyMock).toBeCalled()
    expect(notifyMock).toHaveBeenCalledWith(movie)
  })

  it('should return true', async () => {
    const movie = ({} as unknown) as Movie
    const result = await saveMovieUseCase.execute(movie)

    expect(result).toStrictEqual({ body: true })
  })
})
