import { MongoMemoryServer } from 'mongodb-memory-server'

process.env.MONGOMS_ARCH = 'x64'

export default (): Promise<string> =>
  new Promise(async (resolve, reject): Promise<void> => {
    try {
      const mongod = new MongoMemoryServer()
      await mongod.start()
      const uri = mongod.getUri()
      process.env.MONGO_URI = uri
      resolve(uri)
    } catch (err) {
      reject(err)
    }
  })
