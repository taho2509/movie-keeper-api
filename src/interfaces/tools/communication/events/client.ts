import config from '../../config/config'
const stan = require('node-nats-streaming').connect('test-cluster', 'demo-test-automation', {
  url: config.get('NATS_URL'),
})
import logger from '../../logger'

interface Message {
  getSequence(): string
  getData(): string
}

stan.on('connect', (): void => {
  logger.info('Connected to broker system')
})

stan.on('close', (): void => {
  process.exit()
})

export default (channel: string, message: object): Promise<string> =>
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
