import { StatusCodes } from 'http-status-codes'

import { ApplicationError } from '@/errors/base/ApplicationError'

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    status: 'error',
    message: err.message,
  })
}

export { errorHandler }
