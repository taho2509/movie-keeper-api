import DataProvider from '../../../../domain/interfaces/data-provider.interface'
import Search from '../../../../domain/entities/search'
import axios, { AxiosRequestConfig } from 'axios'
import Movie from '../../../../domain/entities/movie'
import { NotFoundError } from '../../errors'

const url = process.env.OMDb_URL
const apiKey = process.env.OMDb_API_KEY

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
      const { data } = await axios.get(url, options)

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
