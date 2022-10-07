interface MailMessage {
  from?: {
    name: string
    email: string
  }
  to: string
  subject: string
  body: string
}

interface IMailer {
  sendEmail(message: MailMessage): Promise<void>
}

export { IMailer, MailMessage }
