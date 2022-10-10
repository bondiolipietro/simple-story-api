import winston, { LoggerOptions } from 'winston'
import TransportStream from 'winston-transport'
import { SeqTransport } from '@datalust/winston-seq'

import { mongoConfig } from '@/config/mongo'
import { ApiInfo } from '@/constants/api-info'

import 'winston-mongodb'

const mongoUserPass = mongoConfig.username ? `${mongoConfig.username}:${mongoConfig.password}@` : ''

const transports: TransportStream[] = [new winston.transports.Console()]

const loggerConfigBase: LoggerOptions = {
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: {
    application: ApiInfo.NAME,
  },
  transports,
}

const generateLoggerConfig = () => {
  if (process.env.ENABLE_SEQ_LOGGER === 'true') {
    transports.push(
      new SeqTransport({
        serverUrl: `http://${process.env.SEQ_URL}:${process.env.SEQ_PORT}`,
        apiKey: process.env.SEQ_API_KEY,
        onError: (error: unknown) => {
          if (process.env.NODE_ENV !== 'production') {
            console.error('SeqTransport error.', error)
          }
        },
        handleExceptions: true,
        handleRejections: true,
      }),
    )
  }
  if (process.env.ENABLE_MONGO_LOGGER === 'true') {
    transports.push(
      new winston.transports.MongoDB({
        level: 'warn',
        db: `mongodb://${mongoUserPass}${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`,
        collection: 'logs',
        options: {
          useUnifiedTopology: true,
        },
      }),
    )
  }

  loggerConfigBase.transports = transports

  return loggerConfigBase
}

const loggerConfig = generateLoggerConfig()

export { loggerConfig }
