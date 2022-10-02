import Bull, { Queue } from 'bull'
import { RedisOptions } from 'ioredis'

import { mailQueueConfig, MailQueueConfig } from '@/config/mail-queue'
import { IMailer, mailer, MailMessage } from '@/services/mailer'
import { logger } from '@/services/logger'
import { redisConfig } from '@/config/redis'

class MailQueue {
  private _config: MailQueueConfig
  private _queue: Queue<MailMessage>
  private _mailer: IMailer

  constructor(config: MailQueueConfig, mailer: IMailer, redisOptions: RedisOptions) {
    console.log(redisOptions)
    this._config = config
    this._queue = new Bull(config.name, { redis: redisOptions })
    this.configureListeners()
    this._mailer = mailer
  }

  private configureListeners() {
    this._queue.on('error', (err) => {
      logger.error(err)
    })

    this._queue.on('stalled', (job) => {
      logger.info(`Job ${job.id} is stalled`)
    })

    this._queue.on('completed', (job) => {
      logger.info(`Job ${job.id} is completed`)
    })

    this._queue.on('failed', (job, err) => {
      logger.error(`Job ${job.id} failed: ${err.message}`)
    })
  }

  private getJobHandler() {
    return async (job: Bull.Job<MailMessage>) => await this._mailer.sendEmail(job.data)
  }

  public async add(data: MailMessage) {
    logger.info('Adding job to mail queue...', data.to)

    await this._queue.add(data)
  }

  public async process() {
    logger.info('Starting mail queue...')

    this._queue.process(this._config.concurrency, this.getJobHandler())

    logger.info('Mail queue started')
  }
}

const mailQueue = new MailQueue(mailQueueConfig, mailer, redisConfig)

export { mailQueue }
