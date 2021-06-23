export default interface Interactor {
  execute(input: Record<string, unknown>): Promise<Record<string, unknown>>
}
