import { Schema, model, Model, Types } from 'mongoose'

type IFile = {
  _id: Types.ObjectId
  title: string
  url: string
  key: string
  alt?: string
}

type IFileDocument = Document & IFile

type IFileModel = Model<IFileDocument>

const FileSchema = new Schema<IFile>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  key: { type: String, required: true },
  alt: String,
})

const File = model<IFileDocument, IFileModel>('File', FileSchema)

export { File, IFile, IFileDocument, IFileModel }
