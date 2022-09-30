import express from 'express'
import * as dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
// Util middleware
import cors from 'cors'
import rateLimiter from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'

import ApiRoutes from '@/constants/ApiRoutes'
import { swaggerSpec } from '@/config/swagger'
import { connectDB } from '@/database/connect'
import { notFound } from '@/middleware/notFound'
import { errorHandler } from '@/middleware/errorHandler'
import { configureRoutes as v1Routes } from '@/routes/v1'
import { logger } from '@/utils/logger'
import { TimeUtil } from '@/utils/TimeUtil'

dotenv.config()

// Create express app
let app = express()

// Security middleware config
app.use(
  rateLimiter({
    windowMs: TimeUtil.getMsFromMinutes(5),
    max: 60,
  }),
)
app.use(helmet())
app.use(cors())
app.use(mongoSanitize())

// Request content middleware config
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

// Configure routes
app = v1Routes(app)

// Configure swagger
app.use(ApiRoutes.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Configure util routes
// "Not found" route should be last one to be configured
app.use(notFound)

// Default error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      logger.info(`API is listening on ${PORT}`)
    })
  } catch (error) {
    logger.error(error)
  }
}

start()
