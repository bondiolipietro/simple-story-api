import jwt from 'jsonwebtoken'
import { CookieOptions, Response } from 'express'

import { UserRole } from '@/models/User'
import { TimeUtil } from '@/utils/TimeUtil'

type TokenUser = {
  id: string
  email: string
  role: UserRole
}

type JtwPayload = {
  user: TokenUser
}

class JwtUtil {
  private static readonly ACCESS_TOKEN_COOKIE_NAME = 'accessToken'

  private static readonly JTW_EXPIRATION_TIME = '1h'

  private static readonly DEFAULT_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  }

  static createJWT(payload: JtwPayload, expiresIn = this.JTW_EXPIRATION_TIME) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
  }

  static isTokenValid(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET) as JtwPayload
  }

  static attachCookiesToResponse(res: Response, user: TokenUser) {
    const accessTokenJWT = this.createJWT({ user })

    res.cookie(this.ACCESS_TOKEN_COOKIE_NAME, accessTokenJWT, {
      ...this.DEFAULT_COOKIE_OPTIONS,
      expires: new Date(Date.now() + TimeUtil.getMsFromDays(1)),
    })
  }
}

export { JwtUtil, JtwPayload, TokenUser }
