export type MailQueueConfig = {
  name: string
  concurrency: number
}

const mailQueueConfig: MailQueueConfig = {
  name: 'mail-queue',
  concurrency: 50,
}

export { mailQueueConfig }
