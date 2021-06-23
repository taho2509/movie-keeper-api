import { MongoMemoryServer } from 'mongodb-memory-server'

export default (): Promise<string> =>
  new Promise(async (resolve): Promise<void> => {
    const mongod = new MongoMemoryServer()
    const uri = await mongod.getUri()
    process.env.MONGO_URI = uri
    resolve(uri)
  })
