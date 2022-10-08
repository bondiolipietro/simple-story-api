import * as yup from 'yup'

const loginReqSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  }),
})

const sendRecoverPasswordEmailReqSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
  }),
})

const recoverPasswordReqSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
    token: yup.string().required(),
  }),
})

export { loginReqSchema, sendRecoverPasswordEmailReqSchema, recoverPasswordReqSchema }
