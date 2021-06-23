import { Middleware } from 'koa'
import MovieController from '../../../../interfaces/controllers/movie'
import Movie from '../../../../domain/entities/movie'

const addService: Middleware = async (ctx): Promise<void> => {
  const movie: Movie = {
    title: ctx.request.body.title,
    year: ctx.request.body.year,
    poster: '',
  }
  const response = (await new MovieController().add(movie)) as { body: Record<string, unknown> }

  ctx.body = response.body
}

export default addService
