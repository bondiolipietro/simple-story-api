import { StatusCodes } from 'http-status-codes'
import { addMinutes, isPast } from 'date-fns'

import crypto from 'crypto'

import { User } from '@/models/User'
import { MailService } from '@/services/mailService'
import { JwtUtil } from '@/utils/JwtUtil'
import {
  LoginRequest,
  LoginResponse,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  SendRecoverPasswordEmailRequest,
  SendRecoverPasswordEmailResponse,
} from '@/types'

const login = async (req: LoginRequest, res: LoginResponse) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Please provide email and password',
    })
  }

  const user = await User.findOne({ email })
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'Invalid Credentials',
    })
  }

  const isPasswordCorrect = await user.isValidPassword(password)
  if (!isPasswordCorrect) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'Invalid Credentials',
    })
  }

  const tokenUser = { id: user._id.toString(), email: user.email, role: user.role.toString() }
  JwtUtil.attachCookiesToResponse(res, tokenUser)

  res.status(StatusCodes.OK).send({ status: 'success', message: 'Login successful' })
}

const sendRecoverPasswordEmail = async (
  req: SendRecoverPasswordEmailRequest,
  res: SendRecoverPasswordEmailResponse,
) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    const passwordResetToken = crypto.randomBytes(40).toString('hex')
    const passwordResetExpires = addMinutes(Date.now(), 30)

    await User.findOneAndUpdate({ email }, { passwordResetToken, passwordResetExpires }, { new: true })

    MailService.sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `<a href="${process.env.APP_URL}/auth/reset-password?token=${passwordResetToken}&email=${user.email}">Reset your password</a>`,
    })
  } finally {
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'If an account with that email exists, you will receive an email shortly',
    })
  }
}

const recoverPassword = async (req: RecoverPasswordRequest, res: RecoverPasswordResponse) => {
  const { email, password, token } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'User does not exist',
    })
  }

  if (user.passwordResetToken !== token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid token',
    })
  }

  if (isPast(user.passwordResetExpires)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Token expired',
    })
  }

  user.password = password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Password reset successful',
  })
}

export const authControlller = {
  login,
  sendRecoverPasswordEmail,
  recoverPassword,
}
