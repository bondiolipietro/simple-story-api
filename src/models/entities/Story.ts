import { Schema, model, Types, Model, PopulatedDoc } from 'mongoose'

import { IFileDocument } from '@/models/entities/File'
import { IUserDocument } from '@/models/entities/User'
import { StoryUserAction } from '@/models/entities/StoryUserAction'

type INote = {
  text: string
}

type IStoryFrameParagraph = {
  text: string
  audio?: PopulatedDoc<IFileDocument>
  images: Array<PopulatedDoc<IFileDocument>>
}

type IStoryFrame = {
  title: string
  paragraphs: Array<IStoryFrameParagraph>
  notes: Array<INote>
}

type IStoryInfo = {
  title: string
  description: string
  image: PopulatedDoc<IFileDocument>
  author: PopulatedDoc<IUserDocument>
  isPrivate: boolean
}

type IStoryAnalytics = {
  views: number
  likes: number
}

type IStory = {
  _id: Types.ObjectId
  frames: Array<IStoryFrame>
  info: IStoryInfo
  analytics: IStoryAnalytics
  createdAt: Date
  updatedAt: Date
  shareToken: string
  shareTokenExpires: Date
  likeStory: (userId: string) => Promise<void>
  dislikeStory: (userId: string) => Promise<void>
  viewStory: (userId: string) => Promise<void>
}

type IStoryObj = Pick<IStory, '_id' | 'frames' | 'info' | 'analytics' | 'createdAt' | 'updatedAt'>

type INewStory = Pick<IStory, 'frames' | 'info'>

type IStoryPreview = Pick<IStory, '_id' | 'info' | 'analytics' | 'createdAt' | 'updatedAt'>

type IStoryDocument = Document & IStory

type IStoryModel = Model<IStoryDocument>

const StoryParagraphSchema = new Schema<IStoryFrameParagraph>({
  text: { type: String, required: true },
  audio: { type: Types.ObjectId, ref: 'File' },
  images: [{ type: Types.ObjectId, ref: 'File' }],
})

const StoryNoteSchema = new Schema<INote>({
  text: { type: String, required: false },
})

const StoryFrameSchema = new Schema<IStoryFrame>({
  title: { type: String, required: true },
  paragraphs: { type: [StoryParagraphSchema], required: true },
  notes: { type: [StoryNoteSchema], default: [] },
})

const StoryInfoSchema = new Schema<IStoryInfo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: Types.ObjectId, ref: 'File' },
  author: { type: Types.ObjectId, required: true },
  isPrivate: { type: Boolean, default: false },
})

const StoryAnalyticsSchema = new Schema<IStoryAnalytics>({
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
})

const StorySchema = new Schema<IStory>(
  {
    frames: { type: [StoryFrameSchema], required: true },
    info: { type: StoryInfoSchema, required: true },
    analytics: { type: StoryAnalyticsSchema, required: true },
    shareToken: { type: String, required: false },
    shareTokenExpires: { type: Date, required: false },
  },
  {
    timestamps: true,
  },
)

StorySchema.method('likeStory', async function (userId: string) {
  const storyUserAction = await StoryUserAction.findOne({ storyId: this._id, userId })
  this.analytics.likes += 1

  if (!storyUserAction) {
    StoryUserAction.create({
      story: this._id,
      user: userId,
      liked: true,
    })
  } else {
    storyUserAction.liked = true
    storyUserAction.save()
  }

  await this.save()
})

StorySchema.method('dislikeStory', async function (userId: string) {
  this.analytics.likes -= 1

  const storyUserAction = await StoryUserAction.findOne({ storyId: this._id, userId })

  if (storyUserAction) {
    storyUserAction.updateOne({ liked: false })
  }

  await this.save()
})

StorySchema.method('viewStory', async function (userId: string) {
  this.analytics.views += 1
  const storyUserAction = await StoryUserAction.findOne({ storyId: this._id, userId })

  if (!storyUserAction) {
    StoryUserAction.create({
      story: this._id,
      user: userId,
      viewCount: 1,
      lastViewed: Date.now(),
    })
  } else {
    storyUserAction.incrementViewCount()
  }

  await this.save()
})

const Story = model<IStoryDocument, IStoryModel>('Story', StorySchema)

export { Story, IStory, IStoryFrame, IStoryDocument, IStoryModel, IStoryObj, INewStory, IStoryPreview }
