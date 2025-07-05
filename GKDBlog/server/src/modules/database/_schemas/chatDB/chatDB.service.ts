import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {ChatDB, ChatRoomDB, ChatRoomTable} from './chatDB.entity'
import {Model, Types} from 'mongoose'

import * as T from '@common/types'

@Injectable()
export class ChatDBService {
  constructor(
    @InjectModel(ChatDB.name) private chatDBModel: Model<ChatDB>,
    @InjectModel(ChatRoomTable.name) private chatRoomTableModel: Model<ChatRoomTable>,
    @InjectModel(ChatRoomDB.name) private chatRoomDBModel: Model<ChatRoomDB>
  ) {}

  async createChat(where: string, chatRoomOId: string, userOId: string, userName: string, content: string) {
    /**
     * 채팅을 DB 에 저장하고 채팅방의 최근날짜 등을 갱신한다.
     * << chatRoomOId 에 mutex lock 이 걸려있어야 한다. >>
     *
     * 1. 채팅방을 불러온다.
     * 2. 채팅을 저장한다.
     * 3. 채팅방의 최근날짜 등을 갱신한다.
     * 4. 리턴
     */
    try {
      // 1. 채팅방을 불러온다.
      const _id = new Types.ObjectId(chatRoomOId)
      const chatRoomDB = await this.chatRoomDBModel.findOne({_id})
      if (!chatRoomDB) {
        throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
      }

      // 2. 채팅을 저장한다.
      const chatIndex = chatRoomDB.chatArrLength
      const date = new Date()
      const dateString = date.toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})
      const chatDB = await this.chatDBModel.create({chatRoomOId, chatIndex, content, date, dateString, userOId, userName})
      if (!chatDB) {
        throw {gkd: {chatRoomOId: `채팅 저장 안됨`}, gkdErr: `채팅 저장 안됨`, gkdStatus: {chatRoomOId}, where}
      }

      // 3. 채팅방의 최근날짜 등을 갱신한다.
      const chatOId = chatDB._id.toString()
      await this.chatRoomDBModel.updateOne({_id}, {$set: {lastChatDate: date, chatArrLength: chatIndex + 1}})

      // 4. 리턴
      const chat: T.ChatType = {
        chatOId,
        chatRoomOId,
        chatIndex,
        date,
        dateString,
        userOId,
        userName,
        content
      }
      return {chat}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async createChatRoom(where: string, userOId: string, targetUserOId: string, targetUserName: string, targetUserId: string) {
    /**
     * chatRoom 을 만든다.
     *
     * 1. chatRoomTable 중복 체크
     * 2. chatRoom 생성
     * 3. 유저마다 chatRoomTable 생성
     * 4. chatRoom 리턴
     */
    try {
      // 1. chatRoomTable 중복 체크
      const checkOId = await this.chatRoomTableModel.findOne({userOId, targetUserOId})
      if (checkOId) {
        throw {gkd: {userOId, targetUserOId: `이미 존재하는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {userOId, targetUserOId}, where}
      }

      const checkOIdReverse = await this.chatRoomTableModel.findOne({userOId: targetUserOId, targetUserOId: userOId})
      if (checkOIdReverse) {
        throw {gkd: {userOId, targetUserOId: `이미 존재하는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {userOId, targetUserOId}, where}
      }

      // 2. chatRoom 생성
      const chatRoomDB = await this.chatRoomDBModel.create({
        userOIdsArr: [userOId, targetUserOId]
      })
      const chatRoomOId = chatRoomDB._id.toString()

      // 3. 유저마다 chatRoomTable 생성
      await this.chatRoomTableModel.create({userOId, targetUserOId, chatRoomOId, isActive: true})
      await this.chatRoomTableModel.create({userOId: targetUserOId, targetUserOId: userOId, chatRoomOId, isActive: false})

      // 4. chatRoom 리턴
      const chatRoom: T.ChatRoomType = {
        chatRoomOId,
        targetUserOId,
        targetUserName,
        targetUserId,
        lastChatDate: chatRoomDB.lastChatDate,
        userOIdsArr: chatRoomDB.userOIdsArr
      }
      return {chatRoom}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readChatArr(where: string, chatRoomOId: string, firstIndex: number, numReadChatMax: number) {
    try {
      if (firstIndex === 0) {
        return {chatArr: []}
      } // ::
      else if (firstIndex > 0) {
        const chatArrDB = await this.chatDBModel
          .find({
            chatRoomOId,
            chatIndex: {
              $lt: firstIndex,
              $gte: Math.max(firstIndex - numReadChatMax, 0)
            }
          })
          .sort({chatIndex: 1})
        const chatArr: T.ChatType[] = chatArrDB.map(chatDB => ({
          chatOId: chatDB._id.toString(),
          chatRoomOId,
          chatIndex: chatDB.chatIndex,
          date: chatDB.date,
          dateString: chatDB.dateString,
          userOId: chatDB.userOId,
          userName: chatDB.userName,
          content: chatDB.content
        }))
        return {chatArr}
      } // ::
      else {
        /**
         * firstIndex 가 -1 로 들어온 경우
         * - 마지막부터 10개를 리턴한다.
         */
        const _id = new Types.ObjectId(chatRoomOId)
        const chatRoomDB = await this.chatRoomDBModel.findOne({_id})
        if (!chatRoomDB) {
          throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
        }
        const {chatArrLength} = chatRoomDB
        const chatArrDB = await this.chatDBModel
          .find({
            chatRoomOId,
            chatIndex: {
              $lt: chatArrLength,
              $gte: Math.max(chatArrLength - numReadChatMax, 0)
            } // ::
          })
          .sort({chatIndex: 1})

        const chatArr: T.ChatType[] = chatArrDB.map(chatDB => ({
          chatOId: chatDB._id.toString(),
          chatRoomOId,
          chatIndex: chatDB.chatIndex,
          date: chatDB.date,
          dateString: chatDB.dateString,
          userOId: chatDB.userOId,
          userName: chatDB.userName,
          content: chatDB.content
        }))

        return {chatArr}
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readChatRoomActiveArr(where: string, userOId: string) {
    /**
     * 활성중인 채팅방의 배열을 리턴한다.
     *   - unreadCount 도 여기서 보내준다.
     *
     * 유의사항
     *   - targetUserId, targetUserName 은 공란으로 리턴된다.
     *   - 정렬을 여기서 할 필요는 없다.
     *     - 어차피 밖에서 Promise.all 로 뭔가를 한 뒤 정렬을 한다
     */
    try {
      const chatRoomTableArrDB = await this.chatRoomTableModel.find({userOId})

      const chatRoomArr: T.ChatRoomType[] = await Promise.all(
        chatRoomTableArrDB.map(async chatRoomTable => {
          const {chatRoomOId, targetUserOId, unreadCount} = chatRoomTable
          const _id = new Types.ObjectId(chatRoomOId)
          const chatRoomDB = await this.chatRoomDBModel.findOne({_id})
          if (!chatRoomDB) {
            throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
          }
          const {lastChatDate, userOIdsArr} = chatRoomDB
          const ret: T.ChatRoomType = {
            chatRoomOId,
            targetUserOId,
            targetUserId: '',
            targetUserName: '',
            lastChatDate,
            userOIdsArr,
            unreadCount
          }
          return ret
        })
      )

      return {chatRoomArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readChatRoomByChatRoomOId(where: string, chatRoomOId: string) {
    try {
      const _id = new Types.ObjectId(chatRoomOId)
      const chatRoomDB = await this.chatRoomDBModel.findOne({_id})
      if (!chatRoomDB) {
        return {chatRoom: null}
      } // ::
      else {
        const {lastChatDate, userOIdsArr} = chatRoomDB
        const chatRoom: T.ChatRoomType = {
          chatRoomOId,
          targetUserOId: userOIdsArr[0],
          targetUserName: '',
          targetUserId: '',
          lastChatDate,
          userOIdsArr
        }
        return {chatRoom}
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readChatRoomByUserOIds(where: string, userOId: string, targetUserOId: string, targetUserName: string, targetUserId: string) {
    try {
      const chatRoomTableDB = await this.chatRoomTableModel.findOne({userOId, targetUserOId})
      if (!chatRoomTableDB) {
        return {chatRoom: null}
      } // ::
      else {
        const {chatRoomOId} = chatRoomTableDB
        const _id = new Types.ObjectId(chatRoomOId)
        const chatRoomDB = await this.chatRoomDBModel.findOne({_id})

        const chatRoom: T.ChatRoomType = {
          chatRoomOId,
          targetUserOId,
          targetUserName,
          targetUserId,
          lastChatDate: chatRoomDB.lastChatDate,
          userOIdsArr: chatRoomDB.userOIdsArr
        }
        return {chatRoom}
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readChatRoomUnreadCount(where: string, userOId: string, chatRoomOId: string) {
    where = where + `/readChatRoomUnreadCount`
    try {
      const chatRoomTableDB = await this.chatRoomTableModel.findOne({userOId, chatRoomOId})
      if (!chatRoomTableDB) {
        throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
      } // ::
      else {
        const {unreadCount} = chatRoomTableDB
        return {unreadCount}
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateChatRoomIncUnreadCnt(where: string, userOId: string, chatRoomOId: string) {
    where = where + `/updateChatRoomIncUnreadCnt`
    try {
      const _id = new Types.ObjectId(chatRoomOId)
      const chatRoomDB = await this.chatRoomDBModel.findOne({_id})
      if (!chatRoomDB) {
        throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
      }

      const chatRoomTableDB = await this.chatRoomTableModel.findOne({userOId, chatRoomOId})
      if (!chatRoomTableDB) {
        throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
      }

      const isActiveChanged = chatRoomTableDB.isActive === false

      await this.chatRoomTableModel.updateOne(
        {userOId, chatRoomOId},
        {
          $inc: {unreadCount: 1},
          $set: {isActive: true} // ::
        }
      )

      return {isActiveChanged, unreadCount: chatRoomTableDB.unreadCount + 1}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateChatRoomResetUnreadCnt(where: string, userOId: string, chatRoomOId: string) {
    where = where + `/updateChatRoomResetUnreadCnt`
    try {
      await this.chatRoomTableModel.updateOne({userOId, chatRoomOId}, {$set: {unreadCount: 0}})
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
