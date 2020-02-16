export default interface ValidationProvider {
  validate(target: object): Promise<boolean>
}
