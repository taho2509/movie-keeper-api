import { Middleware } from 'koa'
import { v4 } from 'uuid'
import correlation from '../../../../interfaces/tools/store'

const correlationalIdMiddleware: Middleware = async (ctx, next): Promise<void> => {
  const correlationalIdHeaderName = 'X-Correlational-Id'

  const correlationalId = ctx.get(correlationalIdHeaderName) || v4()
  ctx.set(correlationalIdHeaderName, correlationalId)

  await correlation.withId(correlationalId, next)
}

export default correlationalIdMiddleware
