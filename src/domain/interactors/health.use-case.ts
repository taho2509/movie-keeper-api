import Interactor from './interactor'

export default class GetHealth implements Interactor {
  public async execute(): Promise<{ body: { message: string } }> {
    return { body: { message: 'The API is healthy' } }
  }
}
