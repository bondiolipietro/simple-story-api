import { Schema, model, Types, Model, PopulatedDoc } from 'mongoose'

import { IStoryDocument } from '@/models/entities/Story'
import { IUserDocument } from '@/models/entities/User'

type IStoryUserAction = {
  _id: Types.ObjectId
  story: PopulatedDoc<IStoryDocument>
  user: PopulatedDoc<IUserDocument>
  liked: boolean
  viewCount: number
  lastViewedAt: Date
  createdAt: Date
  updatedAt: Date
  incrementViewCount: () => Promise<void>
}

type IStoryUserActionDocument = Document & IStoryUserAction

type IStoryUserActionModel = Model<IStoryUserActionDocument>

const StoryUserActionSchema = new Schema<IStoryUserAction>(
  {
    story: { type: Types.ObjectId, ref: 'Story', required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    liked: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    lastViewedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
)

StoryUserActionSchema.method('incrementViewCount', async function () {
  this.viewCount += 1
  this.lastViewedAt = Date.now()

  await this.save()
})

const StoryUserAction = model<IStoryUserActionDocument, IStoryUserActionModel>('StoryUserAction', StoryUserActionSchema)

export { StoryUserAction, IStoryUserAction }
