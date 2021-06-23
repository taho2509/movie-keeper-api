import NotificationProvider from '../../../../domain/interfaces/notification-provider.interface'

export default class ConsoleNotificationProvider implements NotificationProvider {
  public notify(data: Record<string, unknown>): boolean {
    console.log(data)
    return true
  }
}
