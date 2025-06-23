import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class AlarmDB extends Document {
  /** Object Id is in extended class Document */

  /**
   * 알람 내용
   * - readingComment: 댓글 내용
   * - readingReply: 대댓글 내용
   */
  @Prop({type: String, required: true})
  content: string

  @Prop({type: Date, required: true})
  date: Date

  @Prop({type: String, required: true})
  dateString: string

  // 알람 수신됬는지 여부이다. 클라이언트에서 알람버튼 누르면 true 로 바꾼다.
  // 알람을 클릭하면 클릭된 알람은 DB 에서 삭제한다.
  @Prop({type: Boolean, default: false})
  isReceived: boolean

  // 알람을 보낸 유저의 userName
  @Prop({type: String, required: true})
  sendUserName: string

  // 알람을 보낸 유저의 userOId
  @Prop({type: String, required: true})
  sendUserOId: string

  // reading 이면 fileOId 가 들어간다.
  @Prop({type: String, required: true})
  targetObjectId: string

  // 알람을 받은 유저의 userOId
  @Prop({type: String, required: true})
  targetUserOId: string

  @Prop({type: String, required: true})
  type: 'readingComment' | 'readingReply'
}

export const AlarmDBSchema = SchemaFactory.createForClass(AlarmDB)
