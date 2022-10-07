import { SES } from 'aws-sdk'

import { logger } from '@/services/winston-logger'

import { IMailer, MailMessage } from './models/IMailer'

class AwsSesMailer implements IMailer {
  private client: SES

  constructor() {
    this.client = new SES({
      region: process.env.AWS_SES_REGION,
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    })
  }

  async sendEmail(msg: MailMessage) {
    const { from, to, subject, body } = msg

    const emailFrom = from ? `${from.name} <${from.email}>` : process.env.EMAIL_FROM

    const res = await this.client
      .sendEmail({
        Source: emailFrom,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: body,
            },
          },
        },
      })
      .promise()

    logger.info(`Email sent: ${res.MessageId}`)
  }
}

const mailer = new AwsSesMailer()

export { mailer }
