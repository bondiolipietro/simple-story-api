import * as yup from 'yup'

const uploadFileReqSchema = yup.object({
  body: yup.object({
    file: yup.mixed().required(),
  }),
})

export { uploadFileReqSchema }
