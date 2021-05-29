import { Middleware } from 'koa'
import MovieController from '../../../../interfaces/controllers/movie'

const searchService: Middleware = async (ctx): Promise<void> => {
  let response = (await new MovieController().search({ term: ctx.request.query.title[0] })) as { body: object }

  ctx.body = response.body
}

export default searchService
