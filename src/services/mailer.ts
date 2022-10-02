import SES from 'aws-sdk/clients/ses'

export interface MailMessage {
  from?: {
    name: string
    email: string
  }
  to: string
  subject: string
  body: string
}

export interface IMailer {
  sendEmail(message: MailMessage): Promise<void>
}

class Mailer {
  private client: SES

  constructor() {
    this.client = new SES({
      region: process.env.AWS_REGION,
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

    console.log(res)
  }
}

const mailer = new Mailer()

export { mailer }
