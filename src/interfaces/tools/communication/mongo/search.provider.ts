import mongoose from 'mongoose'
import DataProvider from '../../../../domain/interfaces/data-provider.interface'
import Search from '../../../../domain/entities/search'
import Movie from '../../../../domain/entities/movie'
import logger from '../../logger'
import config from '../../config/config'

export interface MovieDocument extends mongoose.Document, Movie {}

const MovieSchema = new mongoose.Schema({
  title: String,
  year: String,
  poster: String,
  released: String,
  runtime: String,
  genre: [String],
  directors: [String],
  writers: [String],
  actors: [String],
  plot: String,
  language: String,
  country: String,
  awards: String,
  production: String,
})

const MovieModel = mongoose.model<MovieDocument>('Movie', MovieSchema)

mongoose.connect(config.get('MONGO_URI'), { useNewUrlParser: true, useUnifiedTopology: true }, (err): void => {
  if (err) throw err
  logger.info('Connected to mongo db')
})

const findMovie = (title: string): Promise<mongoose.Document[]> =>
  new Promise((resolve, reject): void => {
    MovieModel.find({ title: { $regex: '.*' + title + '.*', $options: 'i' } }, (err, res): void => {
      if (err) reject(err)
      else resolve(res)
    })
  })

export default class implements DataProvider {
  public async fetch(search: Search): Promise<Movie[]> {
    const data = this.makeRequest(search)
    return data
  }

  private async makeRequest(search: Search): Promise<Movie[]> {
    try {
      const data = await findMovie(search.term)

      const parsed: Movie[] = data.map(
        (movie: MovieDocument): Movie => {
          return {
            title: movie.title,
            year: movie.year,
            poster: movie.poster,
            directors: movie.directors,
            country: movie.country,
          }
        },
      )

      return parsed
    } catch (error) {
      throw error
    }
  }
}
