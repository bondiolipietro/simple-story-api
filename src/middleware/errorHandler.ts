import { StatusCodes } from 'http-status-codes'

const errorHandler = (err, req, res, next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: err.message,
  })
}

export { errorHandler }
