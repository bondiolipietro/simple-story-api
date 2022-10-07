import { ApplicationError } from './base/ApplicationError'

class InvalidCredentialsError extends ApplicationError {
  constructor(message?: string) {
    super(401, message || 'Invalid credentials.')
  }
}

export { InvalidCredentialsError }
