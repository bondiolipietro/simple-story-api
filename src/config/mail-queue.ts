import { BullQueueConfig } from '@/services/models/BullQueue'

const mailQueueConfig: BullQueueConfig = {
  name: 'mail-queue',
  concurrency: 50,
}

export { mailQueueConfig }
