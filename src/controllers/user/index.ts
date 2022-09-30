import { StatusCodes } from 'http-status-codes'

import crypto from 'crypto'

import { User } from '@/models/User'
import { MailService } from '@/services/mailService'
import { logger } from '@/utils/logger'
import {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  GetUserPreviewByIdRequest,
  GetUserPreviewByIdResponse,
  ResendVerificationEmailRequest,
  ResendVerificationEmailResponse,
  UpdateUserPasswordRequest,
  UpdateUserPasswordResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  VerifyUserEmailRequest,
  VerifyUserEmailResponse,
} from '@/types'

const createUser = async (req: CreateUserRequest, res: CreateUserResponse) => {
  const { email } = req.body

  if (await User.findOne({ email })) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User already exists',
    })
  }

  const verificationToken = crypto.randomBytes(40).toString('hex')

  const user = await User.create({
    name: req.body.name,
    nickname: req.body.nickname,
    description: req.body.description,
    email: req.body.email,
    secondaryEmail: req.body.secondaryEmail,
    password: req.body.password,
    avatar: req.body.avatar,
    verificationToken,
  })

  await MailService.sendEmail({
    to: user.email,
    subject: 'Verify your email',
    html: `<a href="${process.env.APP_URL}/user/verify-email?token=${verificationToken}&email=${user.email}">Verify your email</a>`,
  })

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'User created',
    data: {
      _id: user.id,
    },
  })
}

const verifyUserEmail = async (req: VerifyUserEmailRequest, res: VerifyUserEmailResponse) => {
  const { token, email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User does not exist',
    })
  }

  if (user.isVerified) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User already verified',
    })
  }

  if (user.verificationToken !== token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid token',
    })
  }

  user.isVerified = true
  user.verificationToken = undefined
  await user.save()

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'User verified',
    data: {
      _id: user.id,
    },
  })
}

const resendVerificationEmail = async (req: ResendVerificationEmailRequest, res: ResendVerificationEmailResponse) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User does not exist',
    })
  }

  if (user.isVerified) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User already verified',
    })
  }

  const newVerificationToken = crypto.randomBytes(40).toString('hex')
  await User.findOneAndUpdate({ email }, { verificationToken: newVerificationToken }, { new: true })

  MailService.sendEmail({
    to: user.email,
    subject: 'Verify your email',
    html: `<a href="${process.env.APP_URL}/user/verify-email?token=${newVerificationToken}&email=${user.email}">Verify your email</a>`,
  })

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Verification email sent',
  })
}

const getUserById = async (req: GetUserByIdRequest, res: GetUserByIdResponse) => {
  const { id } = req.params

  console.info(id)
  console.info(req.user)

  if (req.user.id !== id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'Unauthorized',
    })
  }

  const user = await User.findById(id)

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User does not exist',
    })
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'User found',
    data: {
      _id: user.id,
      email: user.email,
      secondaryEmail: user.secondaryEmail,
      name: user.name,
      nickname: user.nickname,
      description: user.description,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
    },
  })
}

const getUserPreviewById = async (req: GetUserPreviewByIdRequest, res: GetUserPreviewByIdResponse) => {
  const { id } = req.params

  const user = await User.findById(id)

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User does not exist',
    })
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'User found',
    data: {
      _id: user.id,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      description: user.description,
      avatar: user.avatar,
    },
  })
}

const updateUser = async (req: UpdateUserRequest, res: UpdateUserResponse) => {
  const { id } = req.params

  if (req.user.id !== id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'Unauthorized',
    })
  }

  const user = await User.findById(id)

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User does not exist',
    })
  }

  const { name, nickname, description, secondaryEmail, avatar } = req.body

  user.name = name
  user.nickname = nickname
  user.description = description
  user.secondaryEmail = secondaryEmail
  user.avatar = avatar

  await user.save()

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'User updated',
    data: {
      _id: user.id,
    },
  })
}

const updateUserPassword = async (req: UpdateUserPasswordRequest, res: UpdateUserPasswordResponse) => {
  const { id } = req.params

  if (req.user.id !== id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'Unauthorized',
    })
  }

  const user = await User.findById(id)

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User does not exist',
    })
  }

  const { password, newPassword } = req.body

  const isPasswordCorrect = await user.isValidPassword(password)

  if (!isPasswordCorrect) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid password',
    })
  }

  user.password = newPassword

  await user.save()

  MailService.sendEmail({
    to: user.email,
    subject: 'Password changed',
    html: 'Your password has been changed',
  })

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Password updated',
    data: {
      _id: user.id,
    },
  })
}

const deleteUser = async (req: DeleteUserRequest, res: DeleteUserResponse) => {
  const { id } = req.params

  if (req.user.id !== id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'Unauthorized',
    })
  }

  const user = await User.findById(id)

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User does not exist',
    })
  }

  await user.remove()

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'User deleted',
    data: {
      _id: user.id,
    },
  })
}

export const userController = {
  createUser,
  verifyUserEmail,
  resendVerificationEmail,
  getUserById,
  getUserPreviewById,
  updateUser,
  updateUserPassword,
  deleteUser,
}
