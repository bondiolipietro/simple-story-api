import multer from 'multer'

const multerConfig: multer.Options = {
  limits: {
    fileSize: 1024 * 1024 * 5, // 10MB
  },
}
export { multerConfig }
