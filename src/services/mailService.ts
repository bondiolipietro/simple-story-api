import nodemailer from 'nodemailer'

import { logger } from '@/utils/logger'

interface Email {
  to: string
  subject: string
  html: string
}

class MailService {
  static async sendEmail({ to, subject, html }: Email) {
    logger.info(`Sending email to ${to}`)
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    return await transporter.sendMail({
      from: '"Foo Bar 👻" <foo@example.com>',
      to,
      subject,
      html,
    })
  }
}

export { MailService }
