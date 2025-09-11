import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'
import {GKDLockService} from '@module/gkdLock'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'

@Injectable()
export class ClientChatPortService {
  constructor(
    private readonly dbHubService: DBHubService,
    private readonly gkdLockService: GKDLockService
  ) {}

  // GET AREA:

  /**
   * loadChatArr
   *  - chatRoomOId 채팅방의 채팅 배열을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - chatArr: 채팅 배열
   */
  async loadChatArr(jwtPayload: T.JwtPayloadType, chatRoomOId: string, firstIdx: number) {
    const where = `/client/chat/loadChatArr`

    let lockString: string = ''
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_ChatRoom(where, jwtPayload, chatRoomOId)

      // 2. 채팅 배열 락 뙇!!
      lockString = await this.gkdLockService.readyLock(chatRoomOId)

      // 3. 채팅 배열 조회 뙇!!
      const {chatArr} = await this.dbHubService.readChatArrByChatRoomOId(where, chatRoomOId, firstIdx)

      // 4. 리턴 뙇!!
      return {chatArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      this.gkdLockService.releaseLock(lockString)
    }
  }

  /**
   * loadChatRoomArr
   *  - userOId 유저의 채팅방 배열을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - chatRoomArr: 채팅방 배열
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 채팅방 배열 조회 뙇!!
   *  3. 리턴 뙇!!
   */
  async loadChatRoomArr(jwtPayload: T.JwtPayloadType, userOId: string) {
    const where = `/client/chat/loadChatRoomArr`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_User(where, jwtPayload, userOId)

      // 2. 채팅방 배열 조회 뙇!!
      const {chatRoomArr} = await this.dbHubService.readChatRoomArrByUserOId(where, userOId)

      // 3. 리턴 뙇!!
      return {chatRoomArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * loadUserChatRoom
   *  - userOId 유저의 targetUserOId 유저와의 채팅방을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - chatRoomOId: 채팅방 아이디
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 채팅방 생성 락 뙇!!
   *  3. 채팅방 조회 뙇!!
   *  4. 존재하지 않으면 생성 뙇!!
   *  5. 리턴 뙇!!
   *
   *  finally. 락 해제 뙇!!
   */
  async loadUserChatRoom(jwtPayload: T.JwtPayloadType, userOId: string, targetUserOId: string) {
    const where = `/client/chat/loadUserChatRoom`

    let lockString: string = ''

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_User(where, jwtPayload, userOId)

      // 2. 채팅방 생성 락 뙇!!
      lockString = await this.gkdLockService.readyLock(`createChatRoom`)

      // 3. 채팅방 조회 뙇!!
      const {chatRoom} = await this.dbHubService.readChatRoomByBothOId(where, userOId, targetUserOId)

      // 4. 존재하지 않으면 생성 뙇!!
      if (!chatRoom) {
        const dto: DTO.CreateChatRoomDTO = {
          userOId,
          targetUserOId
        }
        const {chatRoom} = await this.dbHubService.createChatRoom(where, dto)
        return {chatRoom, isCreated: true}
      }

      return {chatRoom, isCreated: false}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      this.gkdLockService.releaseLock(lockString)
    }
  }
}
