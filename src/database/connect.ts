import mongoose from 'mongoose'

import { mongoConfig } from '@/config/mongo'
import { logger } from '@/services/logger'

const mongoUserPass = mongoConfig.username ? `${mongoConfig.username}:${mongoConfig.password}@` : ''

const mongoConnString = `mongodb://${mongoUserPass}${mongoConfig.host}:${mongoConfig.port}`

const connectMongoDB = async () => {
  logger.info('Connecting to database...')

  await mongoose.connect(mongoConnString, {
    dbName: mongoConfig.database,
  })

  logger.info('Connected to database')
}

export { connectMongoDB, mongoConnString }
