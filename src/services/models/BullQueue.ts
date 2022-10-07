import Bull, { Queue } from 'bull'
import { RedisOptions } from 'ioredis'

import { logger } from '@/services/winston-logger'

interface BullQueueConfig {
  name: string
  concurrency: number
}

abstract class BullQueue<T> {
  protected _config: BullQueueConfig
  protected _queue: Queue<unknown>

  constructor(config: BullQueueConfig, redisOptions: RedisOptions) {
    this._config = config
    this._queue = new Bull(config.name, { redis: redisOptions })
    this.configureListeners()
  }

  private configureListeners() {
    this._queue.on('error', (err) => {
      logger.error(`(Queue: ${this._queue.name})`, err)
    })

    this._queue.on('stalled', (job) => {
      logger.info(`(Queue: ${this._queue.name}) Job ${job.id} is stalled`)
    })

    this._queue.on('completed', (job) => {
      logger.info(`(Queue: ${this._queue.name}) Job ${job.id} is completed`)
    })

    this._queue.on('failed', (job, err) => {
      logger.error(`(Queue: ${this._queue.name}) Job ${job.id} failed: ${err.message}`)
    })
  }

  protected abstract getJobHandler(): (job: Bull.Job<T>) => Promise<void>

  public async add(data: T | T[]): Promise<void> {
    if (Array.isArray(data)) {
      logger.info(`Adding list of jobs to ${this._queue.name} queue...`)
      const parsedJobs = data.map((jobData) => {
        return { data: jobData }
      })

      await this._queue.addBulk(parsedJobs)

      return
    }

    logger.info(`Adding job to ${this._queue.name} queue...`)

    await this._queue.add(data)
  }

  public async process() {
    logger.info(`Starting ${this._queue.name} queue...`)

    this._queue.process(this._config.concurrency, this.getJobHandler())

    logger.info(`${this._queue.name} queue started`)
  }
}

export { BullQueue, BullQueueConfig }
