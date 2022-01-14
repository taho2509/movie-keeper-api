import config from '../../config/config'
import logger from '../../logger'

interface Stan {
  on: (event: string, callback: () => void) => void
  publish: (channel: string, message: string, callback: (err: string, guid: string) => void) => void
}

let stan: Stan

if (config.get('NODE_ENV') !== 'test') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  stan = require('node-nats-streaming').connect('test-cluster', 'demo-test-automation', {
    url: config.get('NATS_URL'),
  })
} else {
  stan = {
    on(): void {
      return
    },
    publish(): void {
      return
    },
  }
}

stan.on('connect', (): void => {
  logger.info('Connected to broker system')
})

stan.on('close', (): void => {
  process.exit()
})

export default (channel: string, message: Record<string, unknown>): Promise<string> =>
  new Promise((resolve, reject): void => {
    stan.publish(channel, JSON.stringify(message), (err: string, guid: string): void => {
      if (err) {
        logger.error(`publish failed: ${err}`)
        if (err) reject(err)
      } else {
        logger.info(`Message send successfully with guid: ${guid}`)
        resolve(guid)
      }
    })
  })
