import { NextFunction } from 'express'

import { JwtUtil } from '@/utils/JwtUtil'
import { User } from '@/models/User'
import { DefaultAuthRequest, DefaultResponse } from '@/types'
import { InvalidCredentialsError, UnauthorizedError, UserNotVerifiedError } from '@/errors/index'
import { logger } from '@/services/logger'
import { ExpressUtil } from '@/utils/ExpressUtil'

/**
 * @description - Middleware that only gets information about the authenticated user
 * @param {DefaultAuthRequest} req - Express request object with custom types
 * @param {DefaultResponse} res - Express response object with custom types
 * @param {NextFunction} next - Express next function
 */
const getUserCredentials = async (req: DefaultAuthRequest, res: DefaultResponse, next: NextFunction) => {
  try {
    const { accessToken } = req.signedCookies

    if (accessToken) {
      const jwtPayload = JwtUtil.isTokenValid(accessToken)
      const user = await User.findById(jwtPayload.user.id)

      if (user || user.isVerified) {
        req.user = jwtPayload.user
      }
    }
  } catch (e) {
    logger.error('User not authenticated or not verified accessing route:', ExpressUtil.getPathFromRequest(req))
  }
  next()
}

/**
 * @description - Middleware that ensures that the user is authenticated, if not, it will throw an error
 * @param {DefaultAuthRequest} req - Express request object with custom types
 * @param {DefaultResponse} _res - Express response object with custom types
 * @param {NextFunction} next - Express next function
 * @throws {UnauthorizedError} - If the user is not authenticated
 * @throws {UserNotVerifiedError} - If the user is not verified
 */
const ensureUserIsAuthenticated = async (req: DefaultAuthRequest, _res: DefaultResponse, next: NextFunction) => {
  try {
    const { accessToken } = req.signedCookies

    if (accessToken) {
      const jwtPayload = JwtUtil.isTokenValid(accessToken)
      const user = await User.findById(jwtPayload.user.id)

      if (!user) {
        throw new UnauthorizedError()
      }
      if (!user.isVerified) {
        throw new UserNotVerifiedError()
      }

      req.user = jwtPayload.user
      return next()
    }

    throw new InvalidCredentialsError()
  } catch (error) {
    throw new InvalidCredentialsError()
  }
}

export { getUserCredentials, ensureUserIsAuthenticated }
