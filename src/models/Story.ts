import { Schema, model, Types, Model, PopulatedDoc } from 'mongoose'

import { IUserDocument } from '@/models/User'
import { StoryUserAction } from '@/models/StoryUserAction'
import { MediaContent } from '@/types'

enum ImageSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

type IStoryAudio = MediaContent

type IStoryImage = MediaContent & {
  size: ImageSize
}

type INote = {
  text: string
}

type IStoryFrameParagraph = {
  text: string
  audio?: IStoryAudio
  images: Array<IStoryImage>
}

type IStoryFrame = {
  title: string
  paragraphs: Array<IStoryFrameParagraph>
  notes: Array<INote>
}

type IStoryInfo = {
  title: string
  description: string
  image: MediaContent
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

const AudioSchema = new Schema<IStoryAudio>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  alt: String,
})

const ImageSchema = new Schema<IStoryImage>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  alt: String,
  size: {
    type: String,
    enum: ImageSize,
    default: ImageSize.MEDIUM,
  },
})

const ParagraphSchema = new Schema<IStoryFrameParagraph>({
  text: { type: String, required: true },
  audio: AudioSchema,
  images: { type: [ImageSchema], required: true },
})

const NoteSchema = new Schema<INote>({
  text: { type: String, required: false },
})

const FrameSchema = new Schema<IStoryFrame>({
  title: { type: String, required: true },
  paragraphs: { type: [ParagraphSchema], required: true },
  notes: { type: [NoteSchema], default: [] },
})

const InfoSchema = new Schema<IStoryInfo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: ImageSchema, required: true },
  author: { type: Types.ObjectId, required: true },
  isPrivate: { type: Boolean, default: false },
})

const AnalyticsSchema = new Schema<IStoryAnalytics>({
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
})

const StorySchema = new Schema<IStory>(
  {
    frames: { type: [FrameSchema], required: true },
    info: { type: InfoSchema, required: true },
    analytics: { type: AnalyticsSchema, required: true },
    shareToken: { type: String, required: false },
    shareTokenExpires: { type: Date, required: false },
  },
  {
    timestamps: true,
  },
)

StorySchema.method('likeStory', async function (userId: string) {
  const like = await StoryUserAction.findOne({ storyId: this._id, userId, type: 'like' })

  if (!like) {
    this.analytics.likes += 1

    await StoryUserAction.create({
      story: this._id,
      user: userId,
      action: 'like',
    })

    await this.save()
  }
})

StorySchema.method('dislikeStory', async function (userId: string) {
  this.analytics.likes -= 1

  await StoryUserAction.deleteOne({ storyId: this._id, userId, type: 'like' })

  await this.save()
})

StorySchema.method('viewStory', async function (userId: string) {
  const view = await StoryUserAction.findOne({ storyId: this._id, userId, type: 'view' })

  if (!view) {
    this.analytics.views += 1

    await StoryUserAction.create({
      story: this._id,
      user: userId,
      action: 'view',
    })

    await this.save()
  }
})

const Story = model<IStoryDocument, IStoryModel>('Story', StorySchema)

export { Story, IStory, IStoryFrame, ImageSize, IStoryDocument, IStoryModel, IStoryObj, INewStory, IStoryPreview }
