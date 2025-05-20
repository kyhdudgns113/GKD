import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class Chat {
  @Prop({type: Number, required: true})
  chatIdx: number

  @Prop({type: Date, default: Date.now})
  date: Date

  @Prop({type: String, required: true})
  uOId: string

  @Prop({type: String, required: true})
  id: string

  @Prop({type: String, required: true})
  content: string
}
export const ChatSchema = SchemaFactory.createForClass(Chat)

@Schema()
export class ChatRoom extends Document {
  @Prop({type: String, default: null})
  clubOId: string | null

  @Prop({type: Number, default: 0})
  length: number

  @Prop({type: [Chat], default: []})
  chatsArr: Chat[]
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom)
