import { Request } from 'express'

interface IFileController {
  uploadFile(req: Request, res: DefaultResponse): Promise<void>
}

export { IFileController }
