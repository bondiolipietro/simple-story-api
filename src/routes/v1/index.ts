import { Express } from 'express'

import { ApiRoutes } from '@/constants/ApiRoutes'
import { ApiVersions } from '@/constants/ApiVersions'
import { logger } from '@/services/logger'

import authRouter from './authRoutes'
import userRouter from './userRoutes'
import storyRouter from './storyRoutes'

const configureRoutes = (app: Express) => {
  logger.info('Configuring routes...')

  logger.info('Configuring /v1/auth routes...')
  app.use(`${ApiVersions.V1}${ApiRoutes.AUTH}`, authRouter)
  logger.info('Configuring /v1/story routes...')
  app.use(`${ApiVersions.V1}${ApiRoutes.STORY}`, storyRouter)
  logger.info('Configuring /v1/user routes...')
  app.use(`${ApiVersions.V1}${ApiRoutes.USER}`, userRouter)

  return app
}

export { configureRoutes }
