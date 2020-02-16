/* eslint-disable @typescript-eslint/explicit-function-return-type */
import SearchMovieUseCase from '../search-movie.use-case'

describe('Health use case', () => {
  let searchUseCase: SearchMovieUseCase = null
  const fetchMock = jest.fn()
  const notifyMock = jest.fn()

  beforeEach(() => {
    searchUseCase = new SearchMovieUseCase(
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
    fetchMock.mockImplementation(() => 'result')
    let response = await searchUseCase.execute(search)
    expect(fetchMock).toHaveBeenCalledWith(search)
    expect(notifyMock).toHaveBeenCalledWith('result')
    expect(response).toStrictEqual({ body: 'result' })
  })
})
