import Koa from 'koa'
import gracefulShutdown from 'http-graceful-shutdown'
import router from './routes/router'
import config from '../../interfaces/tools/config/config'
import logger from '../../interfaces/tools/logger'
import { startMongo, stopMongo } from '../../interfaces/tools/communication/mongo/mongo'

export interface CustomApp extends Koa {
  boot: () => void
  init: () => void
  stop: () => Promise<void>
  server: any
}
const koaApp: Koa = new Koa()
const app = koaApp as CustomApp

app.boot = async (): Promise<void> => {
  logger.info('Environment variables loaded.')

  await startMongo()

  const { default: middlewaresHandler } = await import('./middlewares')
  await middlewaresHandler.register(app)

  app.use(router.routes())

  logger.info('Application booting process ended.')
  app.emit('application:booted')
}

app.init = (): void => {
  const PORT = parseInt(config.get('PORT'), 10) || 8080
  app.server = app.listen(PORT)
  logger.info(`Server started on port: ${PORT}`)

  app.emit('application:started')
}

app.stop = async (): Promise<void> => {
  await stopMongo()
  logger.info('Application gracefulls shutted down.')
}

app.on('error', (err: Error): void => {
  logger.error(err.toString())
  logger.debug(err.stack || '')
})

gracefulShutdown(app, {
  signals: 'SIGINT SIGTERM',
  timeout: 10000,
  forceExit: true,
  finally: app.stop,
})

export default app
