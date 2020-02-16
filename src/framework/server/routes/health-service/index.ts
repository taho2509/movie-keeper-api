import { Middleware } from 'koa'
import HealthController from '../../../../interfaces/controllers/health'

const healthService: Middleware = async (ctx): Promise<void> => {
  let response = (await new HealthController().get()) as { body: object }

  ctx.body = response.body
}

export default healthService
