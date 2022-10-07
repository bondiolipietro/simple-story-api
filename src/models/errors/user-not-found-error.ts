import { ApplicationError } from './base/ApplicationError'

class UserNotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(404, message || 'No User found.')
  }
}

export { UserNotFoundError }
