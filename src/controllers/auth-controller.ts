import { addMinutes, isPast } from 'date-fns'

import crypto from 'crypto'

import { User } from '@/models/entities/User'
import { JwtUtil, ResponseUtil } from '@/utils/index'
import { mailQueue } from '@/services/aws-ses-mail-queue'
import {
  InvalidCredentialsError,
  InvalidFieldsError,
  InvalidTokenError,
  TokenExpiredError,
  UserNotFoundError,
} from '@/models/errors/index'

import { IAuthController } from './interfaces/IAuthController'

class AuthController implements IAuthController {
  public async login(req: LoginRequest, res: LoginResponse) {
    const { email, password } = req.body
    if (!email || !password) {
      throw new InvalidFieldsError('email', 'password')
    }

    const user = await User.findOne({ email })
    if (!user) {
      console.log('b')
      throw new InvalidCredentialsError()
    }

    const isPasswordCorrect = await user.isValidPassword(password)
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError()
    }

    const tokenUser = { id: user._id.toString(), email: user.email, role: user.role }
    JwtUtil.attachCookiesToResponse(res, tokenUser)

    ResponseUtil.Ok(res, 'Login successful').Send()
  }

  public async sendRecoverPasswordEmail(req: SendRecoverPasswordEmailRequest, res: SendRecoverPasswordEmailResponse) {
    const { email } = req.body

    if (!email) {
      throw new InvalidFieldsError('email')
    }

    const user = await User.findOne({ email })

    const passwordResetToken = crypto.randomBytes(40).toString('hex')
    const passwordResetExpires = addMinutes(Date.now(), 30)

    await User.findOneAndUpdate({ email }, { passwordResetToken, passwordResetExpires })

    await mailQueue.add({
      to: user.email,
      subject: 'Reset your password',
      body: `<a href="${process.env.APP_URL}/auth/reset-password?token=${passwordResetToken}&email=${user.email}">Reset your password</a>`,
    })

    ResponseUtil.Ok(res, 'If an account with that email exists, you will receive an email shortly').Send()
  }

  public async recoverPassword(req: RecoverPasswordRequest, res: RecoverPasswordResponse) {
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

    await user.updateOne({ password, passwordResetToken: undefined, passwordResetExpires: undefined })

    ResponseUtil.Ok(res, 'Password reset successful').Send()
  }
}

const authControlller = new AuthController()

export { authControlller }
