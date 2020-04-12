import startStubies from './stubbies'
import startMongo from './mongod'
import startServer from './npm-start'
import startTest from './runner'

const stubbyPort = 4000

process.env.NODE_ENV = 'testing'
process.env.PORT = '3000'
process.env.LOG_LEVEL = 'info'
process.env.OMDB_API_KEY = ''
process.env.OMDB_URL = `http://localhost:${stubbyPort}`
process.env.NATS_URL = ''

const boot = async (): Promise<void> => {
  startStubies(stubbyPort)
  await startMongo()
  await startServer()

  await startTest()
}

boot()
  .then((): void => {
    process.exit(0)
  })
  .catch((error): void => {
    console.error(error)
    process.exit(1)
  })
