import { Request, Response } from 'express'

import { TokenUser } from '@/utils/jwt-util'
import { INewStory, IStory, IStoryObj, IStoryPreview } from '@/models/entities/Story'
import { IPrivateUserInfo, IPublicUserInfo, IUser } from '@/models/entities/User'

export {}

declare global {
  type ResponseStatus = 'success' | 'error'

  type DefaultAuthRequest<T = Request> = T & {
    user?: TokenUser
  }

  declare type DefaultResponse<T = any> = Response<{
    status: ResponseStatus
    message: string
    data?: T
  }>

  //
  // User
  //

  type UserIdObj = Pick<IUser, '_id'>

  type IStoryIdObj = Pick<IStory, '_id'>

  // Create User

  type CreateUserRequest = Request<any, any, IUser>

  type CreateUserResponse = DefaultResponse<UserIdObj>

  // Verify user email

  type VerifyUserEmailReqBody = {
    token: string
    email: string
  }

  type VerifyUserEmailRequest = Request<any, any, VerifyUserEmailReqBody>

  type VerifyUserEmailResponse = DefaultResponse<UserIdObj>

  // Resend verification email

  type ResendVerificationEmailReqBody = {
    email: string
  }

  type ResendVerificationEmailRequest = Request<any, any, ResendVerificationEmailReqBody>

  type ResendVerificationEmailResponse = DefaultResponse

  // Get user by id

  type GetUserByIdParams = {
    id: string
  }

  type GetUserByIdRequest = DefaultAuthRequest<Request<GetUserByIdParams>>

  type GetUserByIdResponse = DefaultResponse<IPrivateUserInfo>

  // Get user preview by id

  type GetUserPreviewByIdParams = {
    id: string
  }

  type GetUserPreviewByIdRequest = Request<GetUserPreviewByIdParams>

  type GetUserPreviewByIdResponse = DefaultResponse<IPublicUserInfo>

  // Update user

  type UpdateUserParams = {
    id: string
  }

  type UpdateUserRequest = DefaultAuthRequest<Request<UpdateUserParams, any, Partial<IUser>>>

  type UpdateUserResponse = DefaultResponse<UserIdObj>

  // Update user password

  type UpdateUserPasswordParams = {
    id: string
  }

  type UpdateUserPasswordReqBody = {
    password: string
    newPassword: string
  }

  type UpdateUserPasswordRequest = DefaultAuthRequest<Request<UpdateUserPasswordParams, any, UpdateUserPasswordReqBody>>

  type UpdateUserPasswordResponse = DefaultResponse<UserIdObj>

  // Delete user

  type DeleteUserParams = {
    id: string
  }

  type DeleteUserRequest = DefaultAuthRequest<Request<DeleteUserParams>>

  type DeleteUserResponse = DefaultResponse<UserIdObj>

  //
  // Auth
  //

  // Login

  type LoginReqBody = {
    email: string
    password: string
  }

  type LoginRequest = Request<any, any, LoginReqBody>

  type LoginResponse = DefaultResponse<UserIdObj>

  // Send recover password email

  type SendRecoverPasswordEmailRequestBody = {
    email: string
  }

  type SendRecoverPasswordEmailRequest = Request<any, any, SendRecoverPasswordEmailRequestBody>

  type SendRecoverPasswordEmailResponse = DefaultResponse

  // Recover password

  type RecoverPasswordReqBody = {
    email: string
    password: string
    token: string
  }

  type RecoverPasswordRequest = Request<any, any, RecoverPasswordReqBody>

  type RecoverPasswordResponse = DefaultResponse

  //
  // Story
  //

  // Share story

  type ShareStoryReqParams = {
    id: string
  }

  type ShareStoryRequest = DefaultAuthRequest<Request<ShareStoryReqParams>>

  type ShareStoryResponseBody = {
    storyId: string
    shareToken: string
  }

  type ShareStoryResponse = DefaultResponse<ShareStoryResponseBody>

  // Get story using share token

  type GetStoryUsingShareTokenReqQuery = {
    storyId: string
    shareToken: string
  }

  type GetStoryUsingShareTokenRequest = Request<any, any, any, GetStoryUsingShareTokenReqQuery>

  type GetStoryUsingShareTokenResponse = DefaultResponse<IStoryObj>

  // Get story by id

  type GetStoryByIdReqParams = {
    id: string
  }

  type GetStoryByIdRequest = DefaultAuthRequest<Request<GetStoryByIdReqParams>>

  type GetStoryByIdResponse = DefaultResponse<IStoryObj>

  // Get story preview by id

  type GetStoryPreviewByIdReqParams = {
    id: string
  }

  type GetStoryPreviewByIdRequest = DefaultAuthRequest<Request<GetStoryPreviewByIdReqParams>>

  type GetStoryPreviewByIdResponse = DefaultResponse<IStoryPreview>

  // Get all stories preview

  type GetStoriesPreviewReqQuery = {
    userId: string
    skip: string
    limit: string
  }

  type GetStoriesPreviewRequest = DefaultAuthRequest<Request<any, any, any, GetStoriesPreviewReqQuery>>

  type GetStoriesPreviewResponse = DefaultResponse<Array<IStoryPreview>>

  // Create story

  type CreateStoryRequest = DefaultAuthRequest<Request<any, any, INewStory>>

  type CreateStoryResponse = DefaultResponse<IStoryIdObj>

  // Update story

  type UpdateStoryReqParams = {
    id: string
  }

  type UpdateStoryRequest = DefaultAuthRequest<Request<UpdateStoryReqParams, any, INewStory>>

  type UpdateStoryResponse = DefaultResponse<IStoryIdObj>

  // Delete story

  type DeleteStoryReqParams = {
    id: string
  }

  type DeleteStoryRequest = DefaultAuthRequest<Request<DeleteStoryReqParams>>

  type DeleteStoryResponse = DefaultResponse<IStoryIdObj>

  // Like story

  type LikeStoryReqParams = {
    id: string
  }

  type LikeStoryRequest = DefaultAuthRequest<Request<LikeStoryReqParams>>

  type LikeStoryResponse = DefaultResponse<IStoryIdObj>

  // Unlike story

  type UnlikeStoryReqParams = {
    id: string
  }

  type UnlikeStoryRequest = DefaultAuthRequest<Request<UnlikeStoryReqParams>>

  type UnlikeStoryResponse = DefaultResponse<IStoryIdObj>

  // View story

  type ViewStoryReqParams = {
    id: string
  }

  type ViewStoryRequest = DefaultAuthRequest<Request<ViewStoryReqParams>>

  type ViewStoryResponse = DefaultResponse<IStoryIdObj>
}
