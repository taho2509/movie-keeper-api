import Search from '../entities/search'
import Movie from '../entities/movie'

export default interface DataProvider {
  fetch(search: Search): Promise<Movie | Movie[]>
}
