import { Schema, model, Types } from 'mongoose'
import bcrypt from 'bcrypt'

import { MediaContent } from 'src/@types'

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

interface IUser {
  _id: Types.ObjectId
  name: string
  nickname: string
  description?: string
  email: string
  secondaryEmail?: string
  password: string
  avatar: MediaContent
  role: UserRole
  verificationToken?: string
  isVerified: boolean
  verifiedAt?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  isValidPassword: (password: string) => Promise<boolean>
}

type IPrivateUserInfo = Pick<
  IUser,
  '_id' | 'name' | 'nickname' | 'description' | 'email' | 'secondaryEmail' | 'avatar' | 'role' | 'isVerified'
>

type IPublicUserInfo = Pick<IUser, '_id' | 'name' | 'nickname' | 'description' | 'email' | 'avatar'>

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  nickname: { type: String, required: false },
  description: String,
  email: { type: String, required: true },
  secondaryEmail: String,
  password: { type: String, required: true },
  avatar: { type: Object, required: true },
  role: {
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT))
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.method('isValidPassword', async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
})

const User = model<IUser>('User', UserSchema)

export { User, IUser, IPrivateUserInfo, IPublicUserInfo }
