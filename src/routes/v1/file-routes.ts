import express from 'express'
import multer from 'multer'

import { multerConfig } from '@/config/multer'
import { fileController } from '@/controllers/file-controller'
import { ensureUserIsAuthenticated } from '@/middlewares/authentication'
import { validator } from '@/middlewares/validator'
import { uploadFileReqSchema } from '@/validators/file-validators'

const router = express.Router()

/**
 * @swagger
 * /v1/file/upload:
 *  post:
 *    tags:
 *      - file
 *    security:
 *      - cookieAuth: []
 *    summary: Upload a file
 *    description: Upload a file and return the file id
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: Returns a success message
 */
router.post(
  '/upload',
  ensureUserIsAuthenticated,
  validator(uploadFileReqSchema),
  multer(multerConfig).single('file'),
  fileController.uploadFile,
)

export { router as fileRouter }
