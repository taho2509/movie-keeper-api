import mongoose from 'mongoose'
import logger from '../../logger'

export const startMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string)
    logger.info('Mongoose initialized, connection stablished.')
  } catch (err) {
    logger.error('Error ocurred when stablishing connection to mongo db.')
    throw err
  }
}

export const stopMongo = async (): Promise<void> => {
  try {
    await mongoose.disconnect()
    logger.info('Mongoose connection closed.')
  } catch (err) {
    logger.error('Error ocurred when stopping connection.')
  }
}
