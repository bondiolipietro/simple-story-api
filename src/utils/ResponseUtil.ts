import { StatusCodes } from 'http-status-codes'

import { DefaultResponse } from '@/types'

class ResponseUtil {
  static Ok(res: DefaultResponse, message: string, data?: unknown) {
    const Send = () =>
      res.status(StatusCodes.OK).json({
        status: 'success',
        message,
        data,
      })

    return { Send }
  }

  static Created(res: DefaultResponse, message: string, data?: unknown) {
    const Send = () =>
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        message,
        data,
      })

    return { Send }
  }
}

export { ResponseUtil }
