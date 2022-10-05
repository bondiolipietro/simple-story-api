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

interface IUserController {
  createUser(req: CreateUserRequest, res: CreateUserResponse): Promise<void>

  verifyUserEmail(req: VerifyUserEmailRequest, res: VerifyUserEmailResponse): Promise<void>

  resendVerificationEmail(req: ResendVerificationEmailRequest, res: ResendVerificationEmailResponse): Promise<void>

  getUserById(req: GetUserByIdRequest, res: GetUserByIdResponse): Promise<void>

  getUserPreviewById(req: GetUserPreviewByIdRequest, res: GetUserPreviewByIdResponse): Promise<void>

  updateUser(req: UpdateUserRequest, res: UpdateUserResponse): Promise<void>

  updateUserPassword(req: UpdateUserPasswordRequest, res: UpdateUserPasswordResponse): Promise<void>

  deleteUser(req: DeleteUserRequest, res: DeleteUserResponse): Promise<void>
}

export { IUserController }
