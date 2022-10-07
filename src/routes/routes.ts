import { Express } from 'express'

import { configureV1Routes } from './v1'

const configureRoutes = (app: Express) => {
  configureV1Routes(app)

  return app
}

export { configureRoutes }
