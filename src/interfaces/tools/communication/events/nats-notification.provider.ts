import { BadGateway } from '../../errors'
import logger from '../../logger'
import { v4 } from 'uuid'
import stan from './client'
import NotificationProvider from '../../../../domain/interfaces/notification-provider.interface'

export interface EventConfig {
  channel: string
  type: string
}

export default class NatsProvider implements NotificationProvider {
  public constructor(
    private readonly config: EventConfig = {
      channel: 'movie_add',
      type: 'com.movie-keeper.movie.add',
    },
  ) {}

  public notify(data: Record<string, unknown>): boolean {
    try {
      logger.info(`Trying to send message to nats`)

      const event = {
        id: v4(),
        source: '/movie-keeper',
        specversion: '1.0',
        type: this.config.type,
        datacontenttype: 'application/json',
        subject: this.config.channel,
        time: new Date().toISOString(),
        data: data,
      }

      stan(this.config.channel, event)
      return true
    } catch (error) {
      throw new BadGateway('sending to nats', {
        errorMessage: error.message,
        payload: data,
      })
    }
  }
}
