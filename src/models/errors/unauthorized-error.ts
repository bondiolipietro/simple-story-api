import { ApplicationError } from './base/ApplicationError'

class UnauthorizedError extends ApplicationError {
  constructor(message?: string) {
    super(401, message || 'Unauthorized.')
  }
}

export { UnauthorizedError }
