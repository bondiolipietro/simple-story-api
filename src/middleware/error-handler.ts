import { Request, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { ApplicationError } from '@/models/errors/base/ApplicationError'
import { logger } from '@/services/winston-logger'
import { ExpressUtil } from '@/utils/express-util'

/**
 * @description - Middleware that only gets information about the authenticated user
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {DefaultResponse} res - Express response object with custom types
 * @param {NextFunction} _next - Express next function
 */
const errorHandler = (err: Error, req: Request, res: DefaultResponse, _next: NextFunction) => {
  logger.error('{@Error} thrown on route: {Route}', err, ExpressUtil.getPathFromRequest(req))

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
    })
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: err.message,
  })
}

export { errorHandler }
