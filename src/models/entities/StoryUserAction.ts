import { Schema, model, Types, Model, PopulatedDoc } from 'mongoose'

import { IStoryDocument } from '@/models/entities/Story'
import { IUserDocument } from '@/models/entities/User'

enum StoryUserActionType {
  VIEW = 'view',
  LIKE = 'like',
}

type IStoryUserAction = {
  _id: Types.ObjectId
  story: PopulatedDoc<IStoryDocument>
  user: PopulatedDoc<IUserDocument>
  type: StoryUserActionType
  createdAt: Date
  updatedAt: Date
}

type IStoryUserActionDocument = Document & IStoryUserAction

type IStoryUserActionModel = Model<IStoryUserActionDocument>

const StoryUserActionSchema = new Schema<IStoryUserAction>(
  {
    story: { type: Types.ObjectId, ref: 'Story'.toString(), required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
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
