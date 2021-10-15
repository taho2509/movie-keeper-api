import DataProvider from '../../../../domain/interfaces/data-provider.interface'
import Search from '../../../../domain/entities/search'
import axios, { AxiosRequestConfig } from 'axios'
import Movie from '../../../../domain/entities/movie'
import { NotFoundError } from '../../errors'
import config from '../../config/config'

const url = config.get('OMDB_URL')
const apiKey = config.get('OMDB_API_KEY')

interface MovieResponse {
  Response: string
  Error: string
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Production: string
}

export default class implements DataProvider {
  public async fetch(search: Search): Promise<Movie> {
    const data = this.makeRequest(search)
    return data
  }

  private async makeRequest(search: Search): Promise<Movie> {
    const options: AxiosRequestConfig = {
      params: {
        t: search.term,
        type: 'movie',
        apikey: apiKey,
      },
    }
    try {
      const { data } = await axios.get<MovieResponse>(url, options)

      if (data.Response === 'True') {
        const parsed: Movie = {
          title: data.Title,
          year: data.Year,
          released: data.Released,
          runtime: data.Runtime,
          genre: this.parseArray(data.Genre),
          directors: this.parseArray(data.Director),
          writers: this.parseArray(data.Writer),
          actors: this.parseArray(data.Actors),
          plot: data.Plot,
          language: data.Language,
          country: data.Country,
          awards: data.Awards,
          poster: data.Poster,
          production: data.Production,
        }
        return parsed
      } else {
        throw new NotFoundError(search.term, {
          errorMessage: data.Error,
          payload: {},
        })
      }
    } catch (error) {
      throw error
    }
  }

  private parseArray(value: string): string[] {
    return value.split(',').map((element): string => element.trim())
  }
}
