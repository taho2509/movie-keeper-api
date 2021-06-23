/* eslint-disable @typescript-eslint/explicit-function-return-type */
import SearchMovieUseCase from '../search-movie.use-case'
import Movie from '../../entities/movie'

describe('Health use case', () => {
  let searchUseCase: SearchMovieUseCase = null
  const fetchMock = jest.fn()
  const notifyMock = jest.fn()

  const movieC = {
    title: 'C',
    year: '1',
    poster: '',
  }

  const listB: Movie[] = [
    {
      title: 'A',
      year: '1',
      poster: '',
    },
    {
      title: 'B',
      year: '1',
      poster: '',
    },
  ]

  const listA: Movie[] = [...listB, movieC]

  beforeEach(() => {
    searchUseCase = new SearchMovieUseCase(
      {
        fetch: fetchMock,
      },
      {
        fetch: fetchMock,
      },
      {
        notify: notifyMock,
      },
    )
  })

  it('Provider should be called', async (): Promise<void> => {
    const search = { term: '' }
    fetchMock.mockImplementationOnce(() => listA).mockImplementationOnce(() => listB)

    const response = await searchUseCase.execute(search)

    expect(fetchMock).toHaveBeenCalledWith(search)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(notifyMock).toHaveBeenCalledWith(listA)
    expect(response).toStrictEqual({
      body: {
        local: listB,
        external: [movieC],
      },
    })
  })
})
