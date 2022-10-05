import { Request } from 'express'

import { DefaultResponse } from '@/types'
import { logger } from '@/services/logger'
import { ExpressUtil } from '@/utils/ExpressUtil'

/**
 * @description - Middleware to handle cases where a route is not found
 * @param {Request} req - Express request object
 * @param {DefaultResponse} res - Express response object with custom types
 */
const notFound = (req: Request, res: DefaultResponse) => {
  logger.error('User trying to access unexistent route {Route}', ExpressUtil.getPathFromRequest(req))

  res.status(404).send({
    status: 'error',
    message: 'Route does not exist',
  })
}

export { notFound }
