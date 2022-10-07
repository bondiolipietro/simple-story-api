import { ApplicationError } from './base/ApplicationError'

class UserAlreadyExistsError extends ApplicationError {
  constructor(message?: string) {
    super(400, message || 'User already exists')
  }
}

export { UserAlreadyExistsError }
