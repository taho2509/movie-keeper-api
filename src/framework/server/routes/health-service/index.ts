import { Middleware } from 'koa'
import HealthController from '../../../../interfaces/controllers/health'

const healthService: Middleware = async (ctx): Promise<void> => {
  const response = (await new HealthController().get()) as { body: Record<string, unknown> }

  ctx.body = response.body
}

export default healthService
