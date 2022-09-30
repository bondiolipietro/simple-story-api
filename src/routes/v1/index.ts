import { Express } from 'express'

import ApiRoutes from '@/constants/ApiRoutes'
import ApiVersions from '@/constants/ApiVersions'
import { logger } from '@/utils/logger'

import authRouter from './auth'
import userRouter from './user'
import storyRouter from './story'

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
