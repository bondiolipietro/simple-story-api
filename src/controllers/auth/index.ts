import { addMinutes, isPast } from 'date-fns'

import crypto from 'crypto'

import { User } from '@/models/User'
import { mailer } from '@/services/mailer'
import { JwtUtil, ResponseUtil } from '@/utils/index'
import {
  InvalidCredentialsError,
  InvalidFieldsError,
  InvalidTokenError,
  TokenExpiredError,
  UserNotFoundError,
} from '@/errors/index'
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
    throw new InvalidFieldsError('email', 'password')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new InvalidCredentialsError()
  }

  const isPasswordCorrect = await user.isValidPassword(password)
  if (!isPasswordCorrect) {
    throw new InvalidCredentialsError()
  }

  const tokenUser = { id: user._id.toString(), email: user.email, role: user.role.toString() }
  JwtUtil.attachCookiesToResponse(res, tokenUser)

  ResponseUtil.Ok(res, 'Login successful').Send()
}

const sendRecoverPasswordEmail = async (
  req: SendRecoverPasswordEmailRequest,
  res: SendRecoverPasswordEmailResponse,
) => {
  const { email } = req.body

  if (!email) {
    throw new InvalidFieldsError('email')
  }

  const user = await User.findOne({ email })

  const passwordResetToken = crypto.randomBytes(40).toString('hex')
  const passwordResetExpires = addMinutes(Date.now(), 30)

  await User.findOneAndUpdate({ email }, { passwordResetToken, passwordResetExpires })

  mailer.sendEmail({
    to: user.email,
    subject: 'Reset your password',
    body: `<a href="${process.env.APP_URL}/auth/reset-password?token=${passwordResetToken}&email=${user.email}">Reset your password</a>`,
  })

  ResponseUtil.Ok(res, 'If an account with that email exists, you will receive an email shortly').Send()
}

const recoverPassword = async (req: RecoverPasswordRequest, res: RecoverPasswordResponse) => {
  const { email, password, token } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    throw new UserNotFoundError()
  }

  if (user.passwordResetToken !== token) {
    throw new InvalidTokenError()
  }

  if (isPast(user.passwordResetExpires)) {
    throw new TokenExpiredError()
  }

  user.password = password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  ResponseUtil.Ok(res, 'Password reset successful').Send()
}

export const authControlller = {
  login,
  sendRecoverPasswordEmail,
  recoverPassword,
}
