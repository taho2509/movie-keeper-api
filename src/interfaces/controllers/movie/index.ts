import SearchUseCase from '../../../domain/interactors/search-movie.use-case'
import SaveMovieUseCase from '../../../domain/interactors/save-movie.use-case'
import MovieProvider from '../../tools/communication/http/movie.provider'
import SearchProvider from '../../tools/communication/http/search.provider'
import MongoProvider from '../../tools/communication/mongo/search.provider'
import Search from '../../../domain/entities/search'
import NatsProvider from '../../tools/communication/events/nats-notification.provider'
import Movie from '../../../domain/entities/movie'

export default class MovieController {
  public constructor() {}

  public async search(search: Search): Promise<object> {
    const searchUseCase = new SearchUseCase(
      new SearchProvider(),
      new MongoProvider(),
      new NatsProvider({ channel: 'movie_search', type: 'com.movie-keeper.movie.search' }),
    )

    let response = await searchUseCase.execute(search)
    return response
  }

  public async get(search: Search): Promise<object> {
    const searchUseCase = new SearchUseCase(
      new MovieProvider(),
      new MongoProvider(),
      new NatsProvider({ channel: 'movie_search', type: 'com.movie-keeper.movie.search' }),
    )

    let response = await searchUseCase.execute(search)
    return response
  }

  public async add(movie: Movie): Promise<object> {
    const saveUseCase = new SaveMovieUseCase(
      // new MovieProvider(),
      new NatsProvider({ channel: 'movie_viewed', type: 'com.movie-keeper.movie.viewed' }),
    )

    let response = await saveUseCase.execute(movie)
    return response
  }
}
