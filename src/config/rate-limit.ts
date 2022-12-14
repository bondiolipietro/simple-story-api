import { TimeUtil } from '@/utils/time-util'

type RateLimitConfig = {
  windowMs: number
  maxConnections: number
}

const rateLimitConfig: RateLimitConfig = {
  windowMs: TimeUtil.getMsFromMinutes(5), // 5 minutes
  maxConnections: 60,
}

export { rateLimitConfig }
