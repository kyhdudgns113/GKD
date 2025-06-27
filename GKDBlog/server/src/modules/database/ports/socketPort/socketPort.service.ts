import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub/databaseHub.service'
import {GKDLockService} from 'src/modules/gkdLock/gkdLock.service'

import * as T from '@common/types'
import * as S from '@common/types/socketTypes'

/**
 *
 */
@Injectable()
export class SocketPortService {
  constructor(
    private readonly dbHubService: DatabaseHubService,
    private readonly lockService: GKDLockService
  ) {}

  async alarmReadingComment(fileUserOId: string, _comment: T.CommentType) {
    /**
     * 댓글이 달렸으므로 알람을 보내는 함수이다.
     *
     * 1. 유저가 존재하는지 췍!!
     * 2. 댓글이 존재하는지 OId 로 췍!!
     * 3. ReadingComment 알람을 생성한다.
     * 4. 수신 확인이 안 된 알람들을 불러온다.
     * 5. 수신 확인이 안 된 알람들의 갯수를 리턴한다.
     */
    const where = `/socket/alarmReadingComment`
    try {
      const {commentOId} = _comment

      // 1. 유저가 존재하는지 췍!!
      const {user} = await this.dbHubService.readUserByUserOId(where, fileUserOId)
      if (!user) {
        throw {gkd: {userOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {userOId: fileUserOId}, where}
      }

      // 2. 댓글이 존재하는지 OId 로 췍!!
      const {comment} = await this.dbHubService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw {gkd: {commentOId: `존재하지 않는 댓글입니다.`}, gkdErr: `댓글 조회 안됨`, gkdStatus: {commentOId}, where}
      }

      // 3. Reading Comment 알람을 생성 뙇!!
      await this.dbHubService.createAlarmReadingComment(where, fileUserOId, comment)

      // 4. 수신 확인이 안 된 알람들을 뙇!!
      const {alarmArr} = await this.dbHubService.readAlarmArrNotReceived(where, fileUserOId)

      // 5. 수신 확인이 안 된 알람들의 갯수를 리턴 뙇!!
      const newAlarmArrLen = alarmArr.length
      return {newAlarmArrLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async alarmReadingReply(targetUserOId: string, reply: T.ReplyType) {
    /**
     * 대댓글이 달렸으므로 알람을 보내는 함수이다.
     *
     * 1. 유저가 존재하는지 췍!!
     * 2. 대댓글이 존재하는지 췍!!
     * 3. ReadingReply 알람을 생성한다.
     * 4. 수신 확인이 안 된 알람들을 불러온다.
     * 5. 수신 확인이 안 된 알람들의 갯수를 리턴한다.
     *
     * 유의사항
     * 1. targetUserOId 를 따로 받는다
     *   - 파일 유저의 OId 를 받아와야 할 수도 있다.
     */
    const where = `/socket/alarmReadingReply`
    try {
      const {commentOId} = reply

      // 1. 유저가 존재하는지 췍!!
      const {user} = await this.dbHubService.readUserByUserOId(where, targetUserOId)
      if (!user) {
        throw {gkd: {userOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {userOId: targetUserOId}, where}
      }

      // 2. 댓글이 존재하는지 췍!!
      const {comment} = await this.dbHubService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw {gkd: {commentOId: `존재하지 않는 대댓글입니다.`}, gkdErr: `대댓글 조회 안됨`, gkdStatus: {commentOId: reply.commentOId}, where}
      }

      const targetOId = comment.fileOId

      // 3. Reading Reply 알람을 생성한다.
      await this.dbHubService.createAlarmReadingReply(where, targetOId, targetUserOId, reply)

      // 4. 수신 확인이 안 된 알람들을 불러온다.
      const {alarmArr} = await this.dbHubService.readAlarmArrNotReceived(where, targetUserOId)

      // 5. 수신 확인이 안 된 알람들의 갯수를 리턴 뙇!!
      const newAlarmArrLen = alarmArr.length
      return {newAlarmArrLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async increaseChatRoomUnreadCnt(userOId: string, chatRoomOId: string) {
    const where = `/socket/increaseChatRoomUnreadCnt`
    /**
     * userOId 의 chatRoomOId 채팅방의 안 읽은 메시지 개수를 1 늘린다.
     *
     * 1. 채팅방이 있는지 췍!!
     * 2. 채팅방에 이 유저가 속해있는지 췍!!
     * 3. 채팅방의 안 읽은 메시지 개수를 1 늘린다.
     * 4. 리턴
     */
    try {
      // 1. 채팅방이 있는지 췍!!
      const {chatRoom: isExist} = await this.dbHubService.readChatRoomByChatRoomOId(where, chatRoomOId)
      if (!isExist) {
        throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
      }

      // 2. 채팅방에 이 유저가 속해있는지 췍!!
      if (!isExist.userOIdsArr.includes(userOId)) {
        throw {
          gkd: {chatRoomOId: `채팅방에 속해있지 않은 유저입니다.`},
          gkdErr: `채팅방 속해있지 않은 유저`,
          gkdStatus: {chatRoomOId, userOId},
          where
        }
      }

      /**
       * 3. 채팅방의 안 읽은 메시지 개수를 1 늘린다.
       *   - isActive 를 true 로 바꾼다.
       *     - 만약 false 에서 true 로 바뀌었다면 isActiveChanged 가 true 이다.
       */
      const {isActiveChanged, unreadCount} = await this.dbHubService.updateChatRoomIncUnreadCnt(where, userOId, chatRoomOId)

      // 4. 리턴
      return {isActiveChanged, unreadCount}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async sendChatMessage(payload: S.ChatMessagePayloadType) {
    const where = `/socket/sendChatMessage`
    /**
     * 클라이언트에서 채팅 메시지를 보낼때 실행한다.
     * - 소켓통신은 여기서 하지 않는다.
     * - readyLock 도 여기서 해제하지 않는다.
     * - chatService 에서 모든 작업을 마치고 락을 해제해야 한다.
     *   - 락 해제하는 함수는 여기에 있다
     *
     * 1. 채팅방이 있는지 췍!!
     * 2. 채팅방에 이 유저가 속해있는지 췍!!
     * 3. chatRoomOId 에 mutex lock 을 뙇!!
     * 4. 채팅 저장을 뙇!!
     * 5. 리턴 뙇!!
     */
    let readyLock = ''
    try {
      const {chatRoomOId, content, userName, userOId} = payload

      // 1. 채팅방이 있는지 췍!!
      const {chatRoom: isExist} = await this.dbHubService.readChatRoomByChatRoomOId(where, payload.chatRoomOId)
      if (!isExist) {
        throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId: payload.chatRoomOId}, where}
      }

      // 2. 채팅방에 이 유저가 속해있는지 췍!!
      if (!isExist.userOIdsArr.includes(userOId)) {
        throw {
          gkd: {chatRoomOId: `채팅방에 속해있지 않은 유저입니다.`},
          gkdErr: `채팅방 속해있지 않은 유저`,
          gkdStatus: {chatRoomOId: payload.chatRoomOId, userOId},
          where
        }
      }

      // 3. chatRoomOId 에 mutex lock 을 뙇!!
      readyLock = await this.lockService.readyLock(chatRoomOId)

      // 4. 채팅 저장 및 채팅방 업데이트를 뙇!!
      const {chat} = await this.dbHubService.createChat(where, chatRoomOId, userOId, userName, content)

      // 5. 리턴 뙇!!
      return {chat, readyLock, userOIdsArr: isExist.userOIdsArr}
      // ::
    } catch (errObj) {
      // ::
      errObj.readyLock = readyLock
      throw errObj
    }
  }

  async updateAlarmArr(userOId: string, receivedAlarmArr: T.AlarmType[]) {
    /**
     * 1. 입력받은 배열에 있는 알람들을 수신된 상태로 바꾼다.
     * 2. 여전히 수신확인 안 된 알람배열을 받는다.
     * 3. 그 갯수를 리턴한다.
     */
    const where = `/socket/updateAlarmArr`
    try {
      // 1. 입력받은 배열에 있는 알람들을 수신된 상태로 바꾼다.
      await this.dbHubService.updateAlarmArrReceived(where, receivedAlarmArr)

      // 2. 여전히 수신확인 안 된 알람배열을 받는다.
      const {alarmArr} = await this.dbHubService.readAlarmArrNotReceived(where, userOId)

      // 3. 그 갯수를 리턴한다.
      const newAlarmArrLen = alarmArr.length
      return {newAlarmArrLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  releaseReadyLock(readyLock: string) {
    this.lockService.releaseLock(readyLock)
  }
}
