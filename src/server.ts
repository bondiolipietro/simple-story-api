import express from 'express'
import 'express-async-errors'
import swaggerUi from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
// Util middleware
import cors from 'cors'
import rateLimiter from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'

// Configure dotenv
import '@/config/dotenv'
import { rateLimitConfig } from '@/config/rate-limit'
import { swaggerSpec } from '@/config/swagger'
import { ApiRoutes } from '@/constants/api-routes'
import { connectMongoDB } from '@/database/connect'
import { notFound } from '@/middlewares/not-found'
import { errorHandler } from '@/middlewares/error-handler'
import { configureRoutes } from '@/routes/routes'
import { mailQueue } from '@/services/aws-ses-mail-queue'
import { logger } from '@/services/winston-logger'

// Create express app
const app = express()

// Security middleware config
app.use(
  rateLimiter({
    windowMs: rateLimitConfig.windowMs,
    max: rateLimitConfig.maxConnections,
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
configureRoutes(app)

// Configure swagger
app.use(ApiRoutes.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Configure not found route
app.use(notFound)

// Default error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    await connectMongoDB()

    mailQueue.process()

    app.listen(PORT, () => {
      logger.info(`API is listening on ${PORT}`)
    })
  } catch (error) {
    logger.error(error)
  }
}

start()
