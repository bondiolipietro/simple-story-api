import crypto from 'crypto'

import { User } from '@/models/entities/User'
import {
  InvalidPasswordError,
  InvalidTokenError,
  UnauthorizedError,
  UserAlreadyExistsError,
  UserAlreadyVerifiedError,
  UserNotFoundError,
} from '@/models/errors/index'
import { mailQueue } from '@/services/aws-ses-mail-queue'
import { ResponseUtil } from '@/utils/response-util'

import { IUserController } from './interfaces/IUserController'

class UserController implements IUserController {
  public async createUser(req: CreateUserRequest, res: CreateUserResponse) {
    const { email } = req.body

    if (await User.findOne({ email })) {
      throw new UserAlreadyExistsError()
    }

    const verificationToken = crypto.randomBytes(40).toString('hex')

    const user = await User.create({
      name: req.body.name,
      nickname: req.body.nickname,
      description: req.body.description,
      email: req.body.email,
      password: req.body.password,
      verificationToken,
    })

    await mailQueue.add({
      to: user.email,
      subject: 'Verify your email',
      body: `<a href="${process.env.APP_URL}/user/verify-email?token=${verificationToken}&email=${user.email}">Verify your email</a>`,
    })

    ResponseUtil.Created(res, 'User created', { _id: user.id }).Send()
  }

  public async verifyUserEmail(req: VerifyUserEmailRequest, res: VerifyUserEmailResponse) {
    const { token, email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.isVerified) {
      throw new UserAlreadyVerifiedError()
    }

    if (user.verificationToken !== token) {
      throw new InvalidTokenError()
    }

    await user.updateOne({ isVerified: true, verificationToken: '' })

    ResponseUtil.Ok(res, 'User verified', { _id: user.id }).Send()
  }

  public async resendVerificationEmail(req: ResendVerificationEmailRequest, res: ResendVerificationEmailResponse) {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.isVerified) {
      throw new UserAlreadyVerifiedError()
    }

    const newVerificationToken = crypto.randomBytes(40).toString('hex')
    await user.updateOne({ verificationToken: newVerificationToken })

    await mailQueue.add({
      to: user.email,
      subject: 'Verify your email',
      body: `<a href="${process.env.APP_URL}/user/verify-email?token=${newVerificationToken}&email=${user.email}">Verify your email</a>`,
    })

    ResponseUtil.Ok(res, 'Verification email sent').Send()
  }

  public async getUserById(req: GetUserByIdRequest, res: GetUserByIdResponse) {
    const { id } = req.params

    if (req.user.id !== id) {
      throw new UnauthorizedError()
    }

    const user = await User.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    ResponseUtil.Ok(res, 'User found', {
      _id: user.id,
      email: user.email,
      secondaryEmail: user.secondaryEmail,
      name: user.name,
      nickname: user.nickname,
      description: user.description,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
    }).Send()
  }

  public async getUserPreviewById(req: GetUserPreviewByIdRequest, res: GetUserPreviewByIdResponse) {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    ResponseUtil.Ok(res, 'User found', {
      _id: user.id,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      description: user.description,
      avatar: user.avatar,
    }).Send()
  }

  public async updateUser(req: UpdateUserRequest, res: UpdateUserResponse) {
    const { id } = req.params

    if (req.user.id !== id) {
      throw new UnauthorizedError()
    }

    const user = await User.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    const { name, nickname, description, secondaryEmail, avatar } = req.body

    await user.updateOne({ name, nickname, description, secondaryEmail, avatar })

    ResponseUtil.Ok(res, 'User updated', { _id: user.id }).Send()
  }

  public async updateUserPassword(req: UpdateUserPasswordRequest, res: UpdateUserPasswordResponse) {
    const { id } = req.params

    if (req.user.id !== id) {
      throw new UnauthorizedError()
    }

    const user = await User.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    const { password, newPassword } = req.body

    const isPasswordCorrect = await user.isValidPassword(password)

    if (!isPasswordCorrect) {
      throw new InvalidPasswordError()
    }

    await user.updateOne({ password: newPassword })

    await mailQueue.add({
      to: user.email,
      subject: 'Password changed',
      body: 'Your password has been changed',
    })

    ResponseUtil.Ok(res, 'Password changed', { _id: user.id }).Send()
  }

  public async deleteUser(req: DeleteUserRequest, res: DeleteUserResponse) {
    const { id } = req.params

    if (req.user.id !== id) {
      throw new UnauthorizedError()
    }

    const user = await User.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    user.delete()

    ResponseUtil.Ok(res, 'User deleted', { _id: user.id }).Send()
  }
}

const userController = new UserController()

export { userController }
