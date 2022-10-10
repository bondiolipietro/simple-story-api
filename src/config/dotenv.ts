import * as dotenv from 'dotenv'

console.info('Trying to load environment variables from .env file')

dotenv.config()

if (process.env.PORT) {
  console.info(`Env variables loaded. ex: PORT=${process.env.PORT}`)
}
