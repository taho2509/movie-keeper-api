const envKeys: string[] = ['PORT', 'NODE_ENV', 'LOG_LEVEL', 'MONGO_URI', 'NATS_URL', 'OMDB_URL', 'OMDB_API_KEY']

interface Configurations {
  get: (key: string) => string
  getAll: () => Map<string, string | undefined>
}

function configureEnvironmentVariables(): Configurations {
  const configurations = new Map<string, string | undefined>()
  envKeys.forEach((key): void => {
    configurations.set(key, process.env[key])
  })

  return {
    get: (key): string => configurations.get(key) || '',
    getAll: (): Map<string, string | undefined> => configurations,
  }
}

const configuration = configureEnvironmentVariables()
export default configuration
