import { ApplicationError } from './base/ApplicationError'

class StoryNotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(404, message || 'No Story found.')
  }
}

export { StoryNotFoundError }
