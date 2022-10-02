import { RedisOptions } from 'ioredis'

const redisConfig: RedisOptions = {
  host: process.env.REDIS_URL || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASS,
}

export { redisConfig }
