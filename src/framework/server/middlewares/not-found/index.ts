import { Middleware } from 'koa'
import { NotFoundError } from '../../../../interfaces/tools/errors'

const notFoundHandler: Middleware = async (ctx, next): Promise<void> => {
  await next()
  if (ctx.response.status === 404) {
    throw new NotFoundError(ctx.request.url, {
      errorMessage: `Route ${ctx.request.url} Not Found`,
      payload: {},
    })
  }
}

export default notFoundHandler
