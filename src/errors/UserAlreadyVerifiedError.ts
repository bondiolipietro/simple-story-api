import { ApplicationError } from './base/ApplicationError'

class UserAlreadyVerifiedError extends ApplicationError {
  constructor(message?: string) {
    super(400, message || 'User already verified.')
  }
}

export { UserAlreadyVerifiedError }
