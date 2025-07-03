import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class ChatDB extends Document {
  /** Object Id is in extended class Document */

  @Prop({type: String, required: true})
  chatRoomOId: string

  @Prop({type: Number, required: true})
  chatIndex: number

  @Prop({type: String, required: true})
  content: string

  @Prop({type: Date, required: true})
  date: Date

  @Prop({type: String, required: true})
  dateString: string

  @Prop({type: String, required: true})
  userOId: string

  @Prop({type: String, required: true})
  userName: string
}
export const ChatDBSchema = SchemaFactory.createForClass(ChatDB)

@Schema()
export class ChatRoomTable extends Document {
  @Prop({type: String, required: true})
  userOId: string

  @Prop({type: String, required: true})
  targetUserOId: string

  /**
   * userOId 와 targetUserOId 가 바뀐것도 저장을 해야한다.
   * - chatRoomOId 는 중복된다.
   * - unique 는 false 로 해야한다.
   */
  @Prop({type: String, required: true, unique: false})
  chatRoomOId: string

  /**
   * 채팅방이 userOId 의 채팅 목록에 있는지 여부
   *
   * - 채팅방을 먼저 만든 유저는 true 를 넣는다.
   * - 채팅방이 만들어진 유저는 false 를 넣는다.
   */
  @Prop({type: Boolean, required: true})
  isActive: boolean

  @Prop({type: Number, default: 0})
  unreadCount: number
}
export const ChatRoomTableSchema = SchemaFactory.createForClass(ChatRoomTable)

@Schema()
export class ChatRoomDB extends Document {
  /** Object Id is in extended class Document */

  @Prop({type: Number, default: 0})
  chatArrLength: number

  @Prop({type: Date, default: new Date()})
  lastChatDate: Date

  @Prop({type: [String], required: true})
  userOIdsArr: string[]
}
export const ChatRoomDBSchema = SchemaFactory.createForClass(ChatRoomDB)
