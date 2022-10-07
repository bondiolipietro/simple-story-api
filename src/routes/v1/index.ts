import { Express } from 'express'

import { logger } from '@/services/winston-logger'
import { ApiVersions } from '@/constants/api-versions'
import { ApiRoutes } from '@/constants/api-routes'

import { authRouter } from './auth-routes'
import { fileRouter } from './file-routes'
import { userRouter } from './user-routes'
import { storyRouter } from './story-routes'

const configureV1Routes = (app: Express) => {
  logger.info('Configuring v1 routes...')

  logger.info(`Configuring ${ApiVersions.V1}${ApiRoutes.AUTH} routes...`)
  app.use(`/${ApiVersions.V1}${ApiRoutes.AUTH}`, authRouter)

  logger.info(`Configuring ${ApiVersions.V1}${ApiRoutes.FILE} routes...`)
  app.use(`/${ApiVersions.V1}${ApiRoutes.FILE}`, fileRouter)

  logger.info(`Configuring ${ApiVersions.V1}${ApiRoutes.STORY} routes...`)
  app.use(`/${ApiVersions.V1}${ApiRoutes.STORY}`, storyRouter)

  logger.info(`Configuring ${ApiVersions.V1}${ApiRoutes.USER} routes...`)
  app.use(`/${ApiVersions.V1}${ApiRoutes.USER}`, userRouter)
}

export { configureV1Routes }
