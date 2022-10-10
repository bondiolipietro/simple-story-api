import * as yup from 'yup'

const newUserBodySchema = yup.object({
  name: yup.string().required(),
  nickname: yup.string().required(),
  description: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
})

const createUserReqSchema = yup.object({
  body: newUserBodySchema,
})

const updateUserReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
  body: newUserBodySchema,
})

const verifyUserEmailReqSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    token: yup.string().required(),
  }),
})

const resendVerificationEmailReqSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
  }),
})

const getUserByIdReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

const getUserPreviewByIdReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

const updateUserPasswordReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
  body: yup.object({
    password: yup.string().required(),
    newPassword: yup.string().required(),
  }),
})

const deleteUserReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

export {
  createUserReqSchema,
  updateUserReqSchema,
  verifyUserEmailReqSchema,
  resendVerificationEmailReqSchema,
  getUserByIdReqSchema,
  getUserPreviewByIdReqSchema,
  updateUserPasswordReqSchema,
  deleteUserReqSchema,
}
