import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

// AREA1: 댓글 관련 엔티티
@Schema()
export class ReplyTypeClass {
  @Prop({type: String, required: true})
  commentOId: string

  @Prop({type: Date, default: new Date()})
  date: Date

  // 시간대에 따라서 다르게 나오는걸 방지한다.
  @Prop({type: String, required: true})
  dateString: string

  @Prop({type: String, required: true})
  content: string

  @Prop({type: String, required: true})
  targetUserOId: string

  @Prop({type: String, required: true})
  targetUserName: string

  @Prop({type: String, required: true})
  userName: string

  @Prop({type: String, required: true})
  userOId: string
}

@Schema()
export class CommentDB extends Document {
  @Prop({type: String, required: true})
  content: string

  @Prop({type: Date, default: new Date()})
  date: Date

  // 시간대에 따라서 다르게 나오는걸 방지한다.
  @Prop({type: String, required: true})
  dateString: string

  @Prop({type: String, required: true})
  fileOId: string

  @Prop({type: [ReplyTypeClass], default: []})
  replyArr: ReplyTypeClass[]

  @Prop({type: String, required: true})
  userName: string

  @Prop({type: String, required: true})
  userOId: string
}

// AREA2: 파일 관련 엔티티
@Schema()
export class ContentTypeClass {
  @Prop({type: String, enum: ['string', 'image'], required: true})
  type: 'string' | 'image'

  @Prop({type: String, default: ''})
  value: string
}

@Schema()
export class FileDB extends Document {
  @Prop({type: [ContentTypeClass], default: []})
  contentsArr: ContentTypeClass[]

  @Prop({type: Boolean, default: false})
  isIntroPost: boolean

  @Prop({type: String, required: true})
  name: string

  @Prop({type: String, required: true})
  parentDirOId: string
}

export const CommentDBSchema = SchemaFactory.createForClass(CommentDB)
export const FileDBSchema = SchemaFactory.createForClass(FileDB)
