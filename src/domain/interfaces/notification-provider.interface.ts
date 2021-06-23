export default interface NotificationProvider {
  notify(data: Record<string, unknown>[] | Record<string, unknown>): boolean
}
