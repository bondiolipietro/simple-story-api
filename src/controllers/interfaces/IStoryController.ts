interface IStoryController {
  shareStory(req: ShareStoryRequest, res: ShareStoryResponse): Promise<void>

  getStoryUsingShareToken(req: GetStoryUsingShareTokenRequest, res: GetStoryUsingShareTokenResponse): Promise<void>

  getStoryById(req: GetStoryByIdRequest, res: GetStoryByIdResponse): Promise<void>

  getStoryPreviewById(req: GetStoryPreviewByIdRequest, res: GetStoryPreviewByIdResponse): Promise<void>

  getStoriesPreviews(req: GetStoriesPreviewRequest, res: GetStoriesPreviewResponse): Promise<void>

  createStory(req: CreateStoryRequest, res: CreateStoryResponse): Promise<void>

  updateStoryById(req: UpdateStoryRequest, res: UpdateStoryResponse): Promise<void>

  deleteStoryById(req: DeleteStoryRequest, res: DeleteStoryResponse): Promise<void>

  likeStory(req: LikeStoryRequest, res: LikeStoryResponse): Promise<void>

  dislikeStory(req: UnlikeStoryRequest, res: UnlikeStoryResponse): Promise<void>

  viewStory(req: ViewStoryRequest, res: ViewStoryResponse): Promise<void>
}

export { IStoryController }
