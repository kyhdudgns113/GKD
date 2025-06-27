import {model} from 'mongoose'
import {ChatDB, ChatRoomDB, ChatRoomTable, ChatDBSchema, ChatRoomTableSchema, ChatRoomDBSchema} from './chatDB.entity'
import {ChatDBService} from './chatDB.service'

export class ChatDBServiceTest {
  private chatDBModel = model(ChatDB.name, ChatDBSchema)
  private chatRoomTableModel = model(ChatRoomTable.name, ChatRoomTableSchema)
  private chatRoomDBModel = model(ChatRoomDB.name, ChatRoomDBSchema)

  public chatDBService = new ChatDBService(this.chatDBModel, this.chatRoomTableModel, this.chatRoomDBModel)
}
