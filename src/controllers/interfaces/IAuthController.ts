interface IAuthController {
  login(req: LoginRequest, res: LoginResponse): Promise<void>

  sendRecoverPasswordEmail(req: SendRecoverPasswordEmailRequest, res: SendRecoverPasswordEmailResponse): Promise<void>

  recoverPassword(req: RecoverPasswordRequest, res: RecoverPasswordResponse): Promise<void>
}

export { IAuthController }
