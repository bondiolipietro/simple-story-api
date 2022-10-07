import { Request } from 'express'

class ExpressUtil {
  static getPathFromRequest(req: Request): string {
    const { baseUrl, path } = req
    return `${baseUrl}${path}`
  }
}

export { ExpressUtil }
