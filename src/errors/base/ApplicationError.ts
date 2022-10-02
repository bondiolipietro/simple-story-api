abstract class ApplicationError extends Error {
  public readonly status = 'fail'
  public statusCode: number

  constructor(statusCode: number, message?: string) {
    super()

    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name

    this.statusCode = statusCode

    this.message = message || 'Something went wrong. Please try again.'
  }
}

export { ApplicationError }
