import { Middleware } from 'koa'
import MovieController from '../../../../interfaces/controllers/movie'

const searchService: Middleware = async (ctx): Promise<void> => {
  const response = (await new MovieController().search({ term: ctx.request.query.title as string })) as {
    body: Record<string, unknown>
  }

  ctx.body = response.body
}

export default searchService
