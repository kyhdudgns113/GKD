import {model} from 'mongoose'
import {Chat, ChatRoom, ChatRoomSchema, ChatSchema} from './chatDB.entity'
import {ChatDBService} from './chatDB.service'

export class ChatDBServiceTest {
  private roomModel = model(ChatRoom.name, ChatRoomSchema)
  private chatModel = model(Chat.name, ChatSchema)

  public chatDBService = new ChatDBService(this.roomModel, this.chatModel)
}
