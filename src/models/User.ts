import { Schema, model, Types, Model } from 'mongoose'
import bcrypt from 'bcrypt'

import { MediaContent } from 'src/@types'

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

type IUser = {
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
  createdAt: Date
  updatedAt: Date
  isValidPassword: (password: string) => Promise<boolean>
}

type IPrivateUserInfo = Pick<
  IUser,
  '_id' | 'name' | 'nickname' | 'description' | 'email' | 'secondaryEmail' | 'avatar' | 'role' | 'isVerified'
>

type IPublicUserInfo = Pick<IUser, '_id' | 'name' | 'nickname' | 'description' | 'email' | 'avatar'>

type IUserDocument = Document & IUser

type IUserModel = Model<IUserDocument>

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    nickname: { type: String, required: false },
    description: String,
    email: { type: String, required: true },
    secondaryEmail: String,
    password: { type: String, required: true },
    avatar: {
      title: String,
      url: String,
      alt: String,
    },
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
  },
  {
    timestamps: true,
  },
)

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT))
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.method('isValidPassword', async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
})

const User = model<IUserDocument, IUserModel>('User', UserSchema)

export { User, IUser, UserRole, IPrivateUserInfo, IPublicUserInfo, IUserDocument }
