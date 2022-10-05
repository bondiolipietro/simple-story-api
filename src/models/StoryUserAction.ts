import { Schema, model, Types, Model, PopulatedDoc } from 'mongoose'

import { IStoryDocument } from '@/models/Story'
import { IUserDocument } from '@/models/User'

enum StoryUserActionType {
  VIEW = 'view',
  LIKE = 'like',
}

type IStoryUserAction = {
  _id: Types.ObjectId
  storyId: PopulatedDoc<IStoryDocument>
  userId: PopulatedDoc<IUserDocument>
  type: StoryUserActionType
  createdAt: Date
  updatedAt: Date
}

type IStoryUserActionDocument = Document & IStoryUserAction

type IStoryUserActionModel = Model<IStoryUserActionDocument>

const StoryUserActionSchema = new Schema<IStoryUserAction>(
  {
    storyId: { type: Types.ObjectId, ref: 'Story' },
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
    type: {
      type: String,
      enum: StoryUserActionType,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const StoryUserAction = model<IStoryUserActionDocument, IStoryUserActionModel>('StoryUserAction', StoryUserActionSchema)

export { StoryUserAction, IStoryUserAction }
