import * as yup from 'yup'

const shareStoryReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

const getStoryUsingShareTokenReqSchema = yup.object({
  query: yup.object({
    shareToken: yup.string().required(),
  }),
})

const getStoryByIdReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

const getStoryPreviewByIdReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

const getStoriesPreviewsReqSchema = yup.object({
  query: yup.object({
    userId: yup.string().required(),
    skip: yup.number().required(),
    limit: yup.number().required(),
  }),
})

const newStoryBodySchema = yup.object({
  info: yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
    image: yup.string().required(),
    author: yup.string().required(),
    isPrivate: yup.boolean().required(),
  }),
  frames: yup.array().of(
    yup.object({
      title: yup.string().required(),
      notes: yup.array().of(
        yup.object({
          text: yup.string().required(),
        }),
      ),
      paragraphs: yup.array().of(
        yup.object({
          text: yup.string().required(),
          audio: yup.string().required(),
          images: yup.array().of(yup.string().required()),
        }),
      ),
    }),
  ),
})

const createStoryReqSchema = yup.object({
  body: newStoryBodySchema,
})

const updateStoryReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
  body: newStoryBodySchema,
})

const deleteStoryByIdReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

const likeStoryReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

const dislikeStoryReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

const viewStoryReqSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
})

export {
  shareStoryReqSchema,
  getStoryUsingShareTokenReqSchema,
  getStoryByIdReqSchema,
  getStoryPreviewByIdReqSchema,
  getStoriesPreviewsReqSchema,
  createStoryReqSchema,
  updateStoryReqSchema,
  deleteStoryByIdReqSchema,
  likeStoryReqSchema,
  dislikeStoryReqSchema,
  viewStoryReqSchema,
}
