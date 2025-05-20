import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class ContentTypeClass {
  @Prop({type: String, enum: ['string', 'image'], required: true})
  type: 'string' | 'image'

  @Prop({type: String, default: ''})
  value: string
}

@Schema()
export class FileDB extends Document {
  @Prop({type: String, required: true})
  name: string

  @Prop({type: [ContentTypeClass], default: []})
  contentsArr: ContentTypeClass[]
}

export const FileDBSchema = SchemaFactory.createForClass(FileDB)
