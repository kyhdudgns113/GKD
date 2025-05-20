import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {Chat, ChatRoom} from './chatDB.entity'
import {ChatRoomType, ChatType} from '../../../../common/types'

@Injectable()
export class ChatDBService {
  constructor(
    @InjectModel(ChatRoom.name) private roomModel: Model<ChatRoom>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>
  ) {}

  async createChatRoom(where: string, clubOId: string) {
    where = where + '/createChatRoom'
    try {
      const newChatRoom = new this.roomModel({clubOId})
      const chatRoomDB = await newChatRoom.save()
      const chatRoom: ChatRoomType = {
        chatRoomOId: chatRoomDB._id.toString(),
        clubOId: clubOId,
        length: 0,
        chatsArr: []
      }

      return {chatRoom}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readChatRoom(where: string, chatRoomOId: string) {
    where = where + '/readChatRoom'
    try {
      const _id = new Types.ObjectId(chatRoomOId)
      const chatRoomDB = await this.roomModel.findOne({_id})
      const chatRoom: ChatRoomType = {
        chatRoomOId,
        clubOId: chatRoomDB.clubOId,
        length: chatRoomDB.length,
        chatsArr: chatRoomDB.chatsArr
      }
      return {chatRoom}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateChatRoomsChat(
    where: string,
    chatRoomOId: string,
    uOId: string,
    id: string,
    content: string
  ) {
    where = where + '/updateChatRoomsChat'
    try {
      const _id = new Types.ObjectId(chatRoomOId)
      const date = new Date()
      const chatRoomDB = await this.roomModel.findOne({_id})
      const chatIdx = chatRoomDB.length
      const newChat = new this.chatModel({chatIdx, date, uOId, id, content})
      await this.roomModel.updateOne({_id}, {$push: {chatsArr: newChat}, $inc: {length: 1}})
      const chat: ChatType = {chatIdx, date, uOId, id, content}
      return {chat}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteChatroomByClubOId(where: string, clubOId: string) {
    where = where + '/deleteChatRoomByClubOId'
    try {
      await this.roomModel.deleteOne({clubOId})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
