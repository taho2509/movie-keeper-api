import Interactor from './interactor'

export default class GetHealth implements Interactor {
  public constructor() {}
  public async execute(): Promise<{ body: { message: string } }> {
    let response = { body: { message: 'The API is healthy' } }
    return response
  }
}
