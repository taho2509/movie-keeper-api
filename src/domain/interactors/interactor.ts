export default interface Interactor {
  execute(input: object): Promise<object>
}
