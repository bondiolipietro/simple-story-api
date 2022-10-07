import Bull from 'bull'
import { RedisOptions } from 'ioredis'

import { BullQueue, BullQueueConfig } from './BullQueue'
import { IMailer, MailMessage } from './IMailer'

class MailQueue extends BullQueue<MailMessage> {
  private _mailer: IMailer

  constructor(config: BullQueueConfig, redisOptions: RedisOptions, mailer: IMailer) {
    super(config, redisOptions)

    this._mailer = mailer
  }

  protected getJobHandler() {
    return async (job: Bull.Job<MailMessage>) => await this._mailer.sendEmail(job.data)
  }
}

export { MailQueue }
