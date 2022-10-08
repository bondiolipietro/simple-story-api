import { ApplicationError } from './base/ApplicationError'

class InvalidFieldsError extends ApplicationError {
  constructor(...fields: string[] | undefined) {
    super(400, `Invalid fields errors: [ ${fields.join(' | ')} ]` || 'Invalid fields.')
  }
}

export { InvalidFieldsError }
