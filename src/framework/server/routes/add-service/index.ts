import { Middleware } from 'koa'
import MovieController from '../../../../interfaces/controllers/movie'
import Movie from '../../../../domain/entities/movie'

const addService: Middleware = async (ctx): Promise<void> => {
  const { title, year } = ctx.request.body as { title: string; year: string }

  const movie: Movie = {
    title,
    year,
    poster: '',
  }
  const response = (await new MovieController().add(movie)) as { body: Record<string, unknown> }

  ctx.body = response.body
}

export default addService
