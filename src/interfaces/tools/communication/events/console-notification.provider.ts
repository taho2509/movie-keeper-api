import NotificationProvider from '../../../../domain/interfaces/notification-provider.interface'

export default class ConsoleNotificationProvider implements NotificationProvider {
  public notify(data: object): boolean {
    console.log(data)
    return true
  }
}
