import { ApplicationError } from './base/ApplicationError'

class UserNotVerifiedError extends ApplicationError {
  constructor(message?: string) {
    super(401, message || 'User is not verified.')
  }
}

export { UserNotVerifiedError }
