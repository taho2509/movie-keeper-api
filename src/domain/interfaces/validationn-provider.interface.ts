export default interface ValidationProvider {
  validate(target: Record<string, unknown>): Promise<boolean>
}
