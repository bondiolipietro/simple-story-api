import { Request } from 'express'

import { awsS3 } from '@/services/aws-s3'
import { File } from '@/models/entities/File'
import { ResponseUtil } from '@/utils/response-util'

import { IFileController } from './interfaces/IFileController'

class FileController implements IFileController {
  public async uploadFile(req: Request, res: DefaultResponse) {
    const { file } = req
    const { alt } = req.body

    const s3Response = await awsS3.uploadFile(file, 'files')

    const createdFile = await File.create({
      title: file.originalname,
      url: s3Response.Location,
      key: s3Response.Key,
      alt,
    })

    ResponseUtil.Created(res, 'File uploaded successfully', { _id: createdFile._id }).Send()
  }
}

const fileController = new FileController()

export { fileController }
