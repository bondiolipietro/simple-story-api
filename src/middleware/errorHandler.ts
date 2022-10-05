import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'

import { ApplicationError } from '@/errors/base/ApplicationError'
import { logger } from '@/services/logger'
import { DefaultResponse } from '@/types'
import { ExpressUtil } from '@/utils/ExpressUtil'

/**
 * @description - Middleware that only gets information about the authenticated user
 * @param {Error} err - Error object
 * @param {Request} _req - Express request object
 * @param {DefaultResponse} res - Express response object with custom types
 */
const errorHandler = (err: Error, _req: Request, res: DefaultResponse) => {
  logger.error('{@Error} thrown on route: {Route}', err, ExpressUtil.getPathFromRequest(_req))

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: err.message,
  })
}

export { errorHandler }
