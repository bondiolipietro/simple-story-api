import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'

import ApiRoutes from '@/constants/ApiRoutes'
import { swaggerSpec } from '@/config/swagger'
import { connectDB } from '@/database/connect'
import { notFound } from '@/middleware/notFound'
import { configureRoutes as v1Routes } from '@/routes/v1'

dotenv.config()

// Create express app
let app = express()

app.use(cors())

// Request content middleware
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

const PORT = process.env.PORT || 3000

const start = async () => {
  app.listen(PORT, () => {
    console.log(`API is listening on ${PORT}`)
  })
}

start()
