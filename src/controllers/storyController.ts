import { addDays, isPast } from 'date-fns'

import crypto from 'crypto'

import { ImageSize, INewStory, IStory, IStoryDocument, IStoryFrame, IStoryPreview, Story } from '@/models/Story'
import { ResponseUtil } from '@/utils/ResponseUtil'
import {
  StoryNotFoundError,
  InvalidTokenError,
  TokenExpiredError,
  ForbiddenError,
  NoResourceFoundError,
} from '@/errors/index'
import {
  ShareStoryRequest,
  ShareStoryResponse,
  GetStoryUsingShareTokenRequest,
  GetStoryUsingShareTokenResponse,
  GetStoryByIdRequest,
  GetStoryByIdResponse,
  GetStoryPreviewByIdRequest,
  GetStoryPreviewByIdResponse,
  GetStoriesPreviewRequest,
  GetStoriesPreviewResponse,
  CreateStoryRequest,
  CreateStoryResponse,
  UpdateStoryRequest,
  UpdateStoryResponse,
  DeleteStoryRequest,
  DeleteStoryResponse,
  LikeStoryRequest,
  LikeStoryResponse,
  UnlikeStoryRequest,
  UnlikeStoryResponse,
  ViewStoryRequest,
  ViewStoryResponse,
} from '@/types'
import { TokenUser } from '@/utils/JwtUtil'
import { IUser, User, UserRole } from '@/models/User'

import { IStoryController } from './interfaces/IStoryController'

class StoryController implements IStoryController {
  public async shareStory(req: ShareStoryRequest, res: ShareStoryResponse): Promise<void> {
    const { id } = req.params

    const story = await Story.findById(id)

    if (!story) {
      throw new StoryNotFoundError()
    }

    this.ensureUserHasAccessToStory(story, req?.user)

    const shareToken = crypto.randomBytes(40).toString('hex')
    const shareTokenExpires = addDays(Date.now(), 7)

    story.shareToken = shareToken
    story.shareTokenExpires = shareTokenExpires

    await story.save()

    ResponseUtil.Ok(res, 'Story shared successfully', {
      storyId: story._id,
      shareToken,
    }).Send()
  }

  public async getStoryUsingShareToken(
    req: GetStoryUsingShareTokenRequest,
    res: GetStoryUsingShareTokenResponse,
  ): Promise<void> {
    const { storyId, shareToken } = req.query

    const story = await Story.findById(storyId)

    if (!story) {
      throw new StoryNotFoundError()
    }

    if (story.shareToken !== shareToken) {
      throw new InvalidTokenError()
    }

    if (isPast(story.shareTokenExpires)) {
      throw new TokenExpiredError()
    }

    ResponseUtil.Ok(res, 'Story retrieved successfully', story).Send()
  }

  public async getStoryById(req: GetStoryByIdRequest, res: GetStoryByIdResponse): Promise<void> {
    const { id } = req.params

    const story = await Story.findById(id)

    if (!story) {
      throw new StoryNotFoundError()
    }

    this.ensureUserHasAccessToStory(story, req?.user)

    ResponseUtil.Ok(res, 'Story retrieved successfully', story).Send()
  }

  public async getStoryPreviewById(req: GetStoryPreviewByIdRequest, res: GetStoryPreviewByIdResponse): Promise<void> {
    const { id } = req.params

    const story = await Story.findById(id)

    if (!story) {
      throw new StoryNotFoundError()
    }

    this.ensureUserHasAccessToStory(story, req?.user)

    const storyPreview = this.getStoryPreviewFromStory(story)

    ResponseUtil.Ok(res, 'Story preview retrieved successfully', storyPreview).Send()
  }

  public async getStoriesPreviews(req: GetStoriesPreviewRequest, res: GetStoriesPreviewResponse): Promise<void> {
    const { userId, skip, limit } = req.query

    if (!userId) {
      const stories = await Story.find({ 'info.private': false })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))

      if (!stories) {
        throw new NoResourceFoundError()
      }

      ResponseUtil.Ok(res, 'Stories retrieved successfully', stories).Send()
    }

    const shouldGetPrivate = !(!req.user || req.user.id !== userId)

    const stories = await Story.find({ 'info.author._id': userId, 'info.private': shouldGetPrivate })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))

    if (!stories) {
      throw new NoResourceFoundError()
    }

    ResponseUtil.Ok(res, 'Stories retrieved successfully', stories).Send()
  }

  public async createStory(req: CreateStoryRequest, res: CreateStoryResponse): Promise<void> {
    const user = await User.findById(req.user.id)

    const newStory = this.getNewStoryFromBody(req.body, user)

    const story = await Story.create(newStory)

    ResponseUtil.Created(res, 'Story created successfully', story).Send()
  }

  public async updateStoryById(req: UpdateStoryRequest, res: UpdateStoryResponse): Promise<void> {
    const { id } = req.params

    const story = await Story.findById(id)

    if (!story) {
      throw new StoryNotFoundError()
    }

    this.ensureUserHasAccessToStory(story, req?.user)

    const user = await User.findById(req.user.id)

    const updatedStory = this.getNewStoryFromBody(req.body, user)

    const updatedStoryDocument = await Story.findByIdAndUpdate(id, updatedStory, { new: true })

    ResponseUtil.Ok(res, 'Story updated successfully', { _id: updatedStoryDocument._id }).Send()
  }

  public async deleteStoryById(req: DeleteStoryRequest, res: DeleteStoryResponse): Promise<void> {
    const { id } = req.params

    const story = await Story.findById(id)

    if (!story) {
      throw new StoryNotFoundError()
    }

    this.ensureUserHasAccessToStory(story, req?.user)

    await story.delete()

    ResponseUtil.Ok(res, 'Story deleted successfully').Send()
  }

  public async likeStory(req: LikeStoryRequest, res: LikeStoryResponse): Promise<void> {
    const { id } = req.params

    const story = await Story.findById(id)

    if (!story) {
      throw new StoryNotFoundError()
    }

    this.ensureUserHasAccessToStory(story, req?.user)

    await story.likeStory(req.user.id)

    ResponseUtil.Ok(res, 'Story liked successfully', story).Send()
  }

  public async dislikeStory(req: UnlikeStoryRequest, res: UnlikeStoryResponse): Promise<void> {
    const { id } = req.params

    const story = await Story.findById(id)

    if (!story) {
      throw new StoryNotFoundError()
    }

    this.ensureUserHasAccessToStory(story, req?.user)

    await story.dislikeStory(req.user.id)

    ResponseUtil.Ok(res, 'Like removed from story successfully', story).Send()
  }

  public async viewStory(req: ViewStoryRequest, res: ViewStoryResponse): Promise<void> {
    const { id } = req.params

    const story = await Story.findById(id)

    if (!story) {
      throw new StoryNotFoundError()
    }

    this.ensureUserHasAccessToStory(story, req?.user)

    await story.viewStory(req.user.id)

    ResponseUtil.Ok(res, 'View add to story successfully', story).Send()
  }

  private getStoryPreviewFromStory(story: IStory): IStoryPreview {
    return {
      _id: story._id,
      info: story.info,
      analytics: story.analytics,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    }
  }

  private getNewStoryFromBody(storyFormData: INewStory, user: IUser): INewStory {
    const { frames, info } = storyFormData

    const newFrames: Array<IStoryFrame> = frames.map((frame) => {
      const newParagraphs = frame.paragraphs.map((paragraph) => {
        const newImages = paragraph.images.map((image) => {
          return {
            title: image.title,
            url: image.url,
            alt: image.alt,
            size: image.size,
          }
        })

        return {
          text: paragraph.text,
          audio: {
            title: paragraph.audio.title,
            url: paragraph.audio.url,
            alt: paragraph.audio.alt,
          },
          images: newImages,
        }
      })

      const newNotes = frame.notes.map((note) => {
        return { text: note.text }
      })

      return {
        title: frame.title,
        paragraphs: newParagraphs,
        notes: newNotes,
      }
    })

    const newStory: INewStory = {
      frames: newFrames,
      info: {
        title: info.title,
        description: info.description,
        image: {
          title: info.image.title,
          url: info.image.url,
          alt: info.image.alt,
        },
        author: user._id,
        isPrivate: info.isPrivate,
      },
    }

    return newStory
  }

  private ensureUserHasAccessToStory(story: IStoryDocument, user: TokenUser): void {
    if (!this.checkUserHasAccessToStory(story, user)) {
      throw new ForbiddenError()
    }
  }

  private checkUserHasAccessToStory(story: IStoryDocument, user: TokenUser): boolean {
    if (user.role === UserRole.ADMIN) {
      return true
    }

    if (story.info.isPrivate) {
      if (story.info.author._id.toString() !== user.id) {
        return false
      }
    }

    return true
  }
}

const storyController = new StoryController()

export { storyController }
