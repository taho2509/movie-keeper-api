import HealthUseCase from '../../../domain/interactors/health.use-case'

export default class HealthController {
  public constructor() {}

  public async get(): Promise<object> {
    const health = new HealthUseCase()

    let response = await health.execute()
    return response
  }
}
