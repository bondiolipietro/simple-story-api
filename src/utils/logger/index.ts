import winston from 'winston'
import { SeqTransport } from '@datalust/winston-seq'

import { ApiInfo } from '@/constants/ApiInfo'

const seqTransport = new SeqTransport({
  serverUrl: process.env.SEQ_SERVER_URL,
  apiKey: process.env.SEQ_API_KEY,
  onError: (error: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('SeqTransport error.', error)
    }
  },
  handleExceptions: true,
  handleRejections: true,
})

const BASE_LOGGER_CONFIG: winston.LoggerOptions = {
  format: winston.format.combine(
    /* This is necessary to get error logs along with stack traces.
    https://github.com/winstonjs/winston/issues/1498 */
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: {
    application: ApiInfo.APPLICATION_NAME,
  },
}

const getLoggerConfig = () => {
  const loggerTransports = []

  if (process.env.ENABLE_SEQ === 'true') {
    loggerTransports.push(seqTransport)
  }
  if (process.env.NODE_ENV !== 'production') {
    const consoleTransport = new winston.transports.Console({
      format: winston.format.simple(),
    })

    loggerTransports.push(consoleTransport)
  }

  BASE_LOGGER_CONFIG.transports = loggerTransports

  return BASE_LOGGER_CONFIG
}

const logger = winston.createLogger(getLoggerConfig())

/**
 * If not in production, logs will also go to the `console` with the format:
 * `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  )
}

export { logger, getLoggerConfig }
