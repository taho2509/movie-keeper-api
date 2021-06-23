import Interactor from './interactor'
import NotificationProvider from '../interfaces/notification-provider.interface'
// import DataProvider from '../interfaces/data-provider.interface'
import Movie from '../entities/movie'

export default class SaveMovieUseCase implements Interactor {
  public constructor(
    // private readonly movieProvider: DataProvider,
    private readonly eventProvider: NotificationProvider,
  ) {}
  public async execute(input: Movie): Promise<Record<string, unknown>> {
    // const movie = await this.movieProvider.fetch({ term: input.title })
    this.eventProvider.notify(input)
    return {
      body: true,
    }
  }
}
