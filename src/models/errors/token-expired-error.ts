import { ApplicationError } from './base/ApplicationError'

class TokenExpiredError extends ApplicationError {
  constructor(message?: string) {
    super(401, message || 'Invalid token.')
  }
}

export { TokenExpiredError }
