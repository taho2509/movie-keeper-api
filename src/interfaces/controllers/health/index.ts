import HealthUseCase from '../../../domain/interactors/health.use-case'

export default class HealthController {
  public async get(): Promise<Record<string, unknown>> {
    const health = new HealthUseCase()

    return await health.execute()
  }
}
