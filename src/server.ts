import express from 'express'
import * as dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { connectDB } from './database/connect'
import { notFound } from './middleware/notFound'
import { configureRoutes as v1Routes } from './routes/v1'

dotenv.config()

// Create express app
let app = express()

app.use(morgan('dev'))
app.use(cors())

// Request content middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

// Configure routes
app = v1Routes(app)

// Configure util routes
app.use(notFound)

const PORT = process.env.PORT || 3000

const start = async () => {
  app.listen(PORT, () => {
    console.log(`API is listening on ${PORT}`)
  })
}

start()
