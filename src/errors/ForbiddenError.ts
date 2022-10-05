import { ApplicationError } from './base/ApplicationError'

class ForbiddenError extends ApplicationError {
  constructor(message?: string) {
    super(403, message || "You don't have permission to access this resource.")
  }
}

export { ForbiddenError }
