import { Express } from 'express'

import authRouter from './auth'
import userRouter from './user'
import storyRouter from './story'

import ApiRoutes from '../../constants/ApiRoutes'
import ApiVersions from '../../constants/ApiVersions'

const configureRoutes = (app: Express) => {
  console.log('Configuring routes...')

  app.use(`${ApiVersions.V1}${ApiRoutes.AUTH}`, authRouter)
  app.use(`${ApiVersions.V1}${ApiRoutes.STORY}`, storyRouter)
  app.use(`${ApiVersions.V1}${ApiRoutes.USER}`, userRouter)

  return app
}

export { configureRoutes }
