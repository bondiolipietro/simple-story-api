import { ApplicationError } from './base/ApplicationError'

class InvalidTokenError extends ApplicationError {
  constructor(message?: string) {
    super(401, message || 'Invalid token.')
  }
}

export { InvalidTokenError }
