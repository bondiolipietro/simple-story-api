import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'

class S3Service {
  private client: S3

  public constructor() {
    this.client = new S3({
      region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    })
  }

  public async uploadFile(file: Express.Multer.File, folder: string) {
    const { originalname, buffer } = file

    const res = await this.client
      .upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${folder}/${uuid()}${Date.now()}${originalname}`,
        Body: buffer,
      })
      .promise()

    return res
  }

  public async uploadMultipleFiles(files: Express.Multer.File[], folder: string) {
    const promises = files.map((file) => this.uploadFile(file, folder))

    const res = await Promise.all(promises)

    return res
  }

  public async getFileStream(key: string) {
    const res = this.client
      .getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
      .createReadStream()

    return res
  }

  public async deleteFile(key: string) {
    await this.client
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
      .promise()
  }
}

const awsS3 = new S3Service()

export { awsS3 }
