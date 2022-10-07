import { ApplicationError } from './base/ApplicationError'

class InvalidPasswordError extends ApplicationError {
  constructor(message?: string) {
    super(400, message || 'Invalid password.')
  }
}

export { InvalidPasswordError }
