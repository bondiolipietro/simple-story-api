import { ApplicationError } from './base/ApplicationError'

class NoResourceFoundError extends ApplicationError {
  constructor(message?: string) {
    super(404, message || 'No resource found.')
  }
}

export { NoResourceFoundError }
