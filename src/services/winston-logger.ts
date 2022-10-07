import { createLogger } from 'winston'

import { loggerConfig } from '@/config/logger'

const logger = createLogger(loggerConfig)

export { logger }
