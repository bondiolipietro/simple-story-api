import { StatusCodes } from 'http-status-codes'

import { JwtUtil } from '@/utils/JwtUtil'
import { User } from '@/models/User'
import { logger } from '@/utils/logger'
import { DefaultAuthRequest, DefaultResponse } from '@/types'

const authenticateUser = async (req: DefaultAuthRequest, res: DefaultResponse, next) => {
  try {
    const { accessToken } = req.signedCookies

    if (accessToken) {
      const jwtPayload = JwtUtil.isTokenValid(accessToken)
      const user = await User.findById(jwtPayload.user.id)

      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'error',
          message: 'Invalid Credentials',
        })
      }
      if (!user.isVerified) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'error',
          message: 'User not verified',
        })
      }

      req.user = jwtPayload.user
      return next()
    }

    res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'Invalid Credentials',
    })
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'Invalid Credentials',
    })
  }
}

export { authenticateUser }
