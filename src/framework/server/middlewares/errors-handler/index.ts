import { Middleware } from 'koa'
import logger from '../../../../interfaces/tools/logger'

const errorsHandler: Middleware = async (ctx, next): Promise<void> => {
  try {
    await next()
  } catch (error) {
    logger.error(error.toString())
    ctx.status = error.meta ? error.meta.code : error.status || 500
    ctx.body = { message: error.message }
  }
}

export default errorsHandler
