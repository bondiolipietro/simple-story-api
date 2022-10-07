import { mailQueueConfig } from '@/config/mail-queue'
import { redisConfig } from '@/config/redis'
import { mailer } from '@/services/aws-ses-mailer'
import { MailQueue } from '@/services/models/MailQueue'

const mailQueue = new MailQueue(mailQueueConfig, redisConfig, mailer)

export { mailQueue }
