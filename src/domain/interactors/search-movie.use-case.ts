import Interactor from './interactor'
import Search from '../entities/search'
import DataProvider from '../interfaces/data-provider.interface'
import NotificationProvider from '../interfaces/notification-provider.interface'
import Movie from '../entities/movie'

export default class SearchMovieUseCase implements Interactor {
  public constructor(
    private readonly externalMovieProvider: DataProvider,
    private readonly localMovieProvider: DataProvider,
    private readonly eventProvider: NotificationProvider,
  ) {}
  public async execute(search: Search): Promise<Record<string, unknown>> {
    let external = (await this.externalMovieProvider.fetch(search)) as Movie[]
    this.eventProvider.notify(external)
    const local = (await this.localMovieProvider.fetch(search)) as Movie[]

    external = this.removeDuplicates(external)
    external = this.removeExistingResultsFromExternal(external, local)

    return { body: { local: local, external: external } }
  }

  private removeDuplicates(movies: Movie[]): Movie[] {
    return movies.filter((first: Movie, firstIndex: number): boolean => this.movieIsInArray(first, movies, firstIndex))
  }

  private removeExistingResultsFromExternal(external: Movie[], local: Movie[]): Movie[] {
    return external.filter((externalMovie: Movie): boolean => this.movieIsInArray(externalMovie, local))
  }

  private movieIsInArray(movie: Movie, movies: Movie[], index = -1): boolean {
    return (
      movies.findIndex((arrayMovie: Movie, arrayIndex: number): boolean => {
        const same = this.areTheSameMovie(arrayMovie, movie)
        if (index !== -1 && same) {
          return index !== arrayIndex && index > arrayIndex
        }
        return same
      }) === -1
    )
  }

  private areTheSameMovie(a: Movie, b: Movie): boolean {
    return b.title === a.title && b.year === a.year
  }
}
