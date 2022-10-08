import { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'yup'
import { AnySchema } from 'yup/lib/schema'

import { InvalidFieldsError } from '@/models/errors'

const validator = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    return next()
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new InvalidFieldsError(...err.errors)
    }

    throw err
  }
}

export { validator }
