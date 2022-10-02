import { Request, Response } from 'express'

import { IPrivateUserInfo, IPublicUserInfo, IUser } from '@/models/User'
import { TokenUser } from '@/utils/JwtUtil'

export type ResponseStatus = 'success' | 'error'

export type DefaultAuthRequest<T = Request> = T & {
  user: TokenUser
}

export type DefaultResponse<T = any> = Response<{
  status: ResponseStatus
  message: string
  data?: T
}>

export type MediaContent = {
  title: string
  url: string
  alt?: string
}

//
// User
//

export type UserIdObj = Pick<IUser, '_id'>

// Create User

export type CreateUserRequest = Request<any, any, IUser>

export type CreateUserResponse = DefaultResponse<UserIdObj>

// Verify user email

export type VerifyUserEmailReqBody = {
  token: string
  email: string
}

export type VerifyUserEmailRequest = Request<any, any, VerifyUserEmailReqBody>

export type VerifyUserEmailResponse = DefaultResponse<UserIdObj>

// Resend verification email

export type ResendVerificationEmailReqBody = {
  email: string
}

export type ResendVerificationEmailRequest = Request<any, any, ResendVerificationEmailReqBody>

export type ResendVerificationEmailResponse = DefaultResponse

// Get user by id

export type GetUserByIdParams = {
  id: string
}

export type GetUserByIdRequest = DefaultAuthRequest<Request<GetUserByIdParams>>

export type GetUserByIdResponse = DefaultResponse<IPrivateUserInfo>

// Get user preview by id

export type GetUserPreviewByIdParams = {
  id: string
}

export type GetUserPreviewByIdRequest = Request<GetUserPreviewByIdParams>

export type GetUserPreviewByIdResponse = DefaultResponse<IPublicUserInfo>

// Update user

export type UpdateUserParams = {
  id: string
}

export type UpdateUserRequest = DefaultAuthRequest<Request<UpdateUserParams, any, Partial<IUser>>>

export type UpdateUserResponse = DefaultResponse<UserIdObj>

// Update user password

export type UpdateUserPasswordParams = {
  id: string
}

export type UpdateUserPasswordReqBody = {
  password: string
  newPassword: string
}

export type UpdateUserPasswordRequest = DefaultAuthRequest<
  Request<UpdateUserPasswordParams, any, UpdateUserPasswordReqBody>
>

export type UpdateUserPasswordResponse = DefaultResponse<UserIdObj>

// Delete user

export type DeleteUserParams = {
  id: string
}

export type DeleteUserRequest = DefaultAuthRequest<Request<DeleteUserParams>>

export type DeleteUserResponse = DefaultResponse<UserIdObj>

//
// Auth
//

// Login

export type LoginReqBody = {
  email: string
  password: string
}

export type LoginRequest = Request<any, any, LoginReqBody>

export type LoginResponse = DefaultResponse<UserIdObj>

// Send recover password email

export type SendRecoverPasswordEmailRequestBody = {
  email: string
}

export type SendRecoverPasswordEmailRequest = Request<any, any, SendRecoverPasswordEmailRequestBody>

export type SendRecoverPasswordEmailResponse = DefaultResponse

// Recover password

export type RecoverPasswordReqBody = {
  email: string
  password: string
  token: string
}

export type RecoverPasswordRequest = Request<any, any, RecoverPasswordReqBody>

export type RecoverPasswordResponse = DefaultResponse
