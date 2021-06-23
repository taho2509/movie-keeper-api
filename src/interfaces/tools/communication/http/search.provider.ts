import DataProvider from '../../../../domain/interfaces/data-provider.interface'
import Search from '../../../../domain/entities/search'
import axios, { AxiosRequestConfig } from 'axios'
import Movie from '../../../../domain/entities/movie'
import config from '../../config/config'

const url = config.get('OMDB_URL')
const apiKey = config.get('OMDB_API_KEY')

interface IncommingResult {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export default class implements DataProvider {
  public async fetch(search: Search): Promise<Movie[]> {
    const data = this.makeRequest(search)
    return data
  }

  private async makeRequest(search: Search): Promise<Movie[]> {
    const options: AxiosRequestConfig = {
      params: {
        s: search.term,
        type: 'movie',
        apikey: apiKey,
      },
    }
    try {
      const { data } = await axios.get(url, options)

      if (data.Response === 'True') {
        const parsed: Movie[] = data.Search.map((movie: IncommingResult): Movie => {
          return {
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster,
          }
        })

        return parsed
      } else {
        return []
      }
    } catch (error) {
      throw error
    }
  }
}
