import {ClientPortService} from '@modules/database'
import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from 'src/common/types'
import {LoggerService} from 'src/modules/logger'
import {SocketGateway} from '@modules/socket/socket.gateway'

@Injectable()
export class ClientUserInfoService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService,
    private readonly socketGateway: SocketGateway
  ) {}

  // PUT AREA:
  async openUserChatRoom(jwtPayload: JwtPayloadType, targetUserOId: string) {
    const where = '/client/userInfo/openUserChatRoom'
    try {
      // 1. port: 채팅방 읽거나 생성
      const {chatRoomOId, chatRoomRowArr} = await this.portService.openUserChatRoom(jwtPayload, targetUserOId)

      // 2. socket: 채팅방 읽었으므로 안읽은 메시지 0으로 수정
      this.socketGateway.openUserChatRoom(jwtPayload.userOId, chatRoomOId)

      return {ok: true, body: {chatRoomOId, chatRoomRowArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  // GET AREA:
  async getChatArr(jwtPayload: JwtPayloadType, chatRoomOId: string, firstIndex: number) {
    const where = '/client/userInfo/getChatArr'
    try {
      const {chatArr} = await this.portService.getChatArr(jwtPayload, chatRoomOId, firstIndex)
      return {ok: true, body: {chatArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getChatRoom(jwtPayload: JwtPayloadType, chatRoomOId: string) {
    const where = '/client/userInfo/getChatRoom'
    try {
      const {chatRoom} = await this.portService.getChatRoom(jwtPayload, chatRoomOId)
      return {ok: true, body: {chatRoom}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getChatRoomRow(jwtPayload: JwtPayloadType, userOId: string, chatRoomOId: string) {
    const where = '/client/userInfo/getChatRoomRow'
    try {
      const {chatRoomRow} = await this.portService.getChatRoomRow(jwtPayload, userOId, chatRoomOId)
      return {ok: true, body: {chatRoomRow}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getChatRoomRowArr(jwtPayload: JwtPayloadType, userOId: string) {
    const where = '/client/userInfo/getChatRoomRowArr'
    try {
      const {chatRoomRowArr} = await this.portService.getChatRoomRowArr(jwtPayload, userOId)
      return {ok: true, body: {chatRoomRowArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getNewAlarmArrLen(jwtPayload: JwtPayloadType, userOId: string) {
    const where = '/client/userInfo/getNewAlarmArrLen'
    try {
      const {newAlarmArrLen} = await this.portService.getNewAlarmArrLen(jwtPayload, userOId)
      return {ok: true, body: {newAlarmArrLen}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async refreshAlarmArr(jwtPayload: JwtPayloadType, userOId: string) {
    const where = '/client/userInfo/refreshAlarmArr'
    try {
      // 1. port: 현재 알람 배열을 가져온다.
      const {alarmArr} = await this.portService.getAlarmArr(jwtPayload, userOId)

      /**
       * 2. socket: 배열 갱신하고 갯수 전달한다.
       *   - 에러 발생해도 여기서는 무시한다.
       */
      this.socketGateway.refreshAlarmArr(userOId, alarmArr)

      // 3. 리턴
      return {ok: true, body: {alarmArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  // DELETE AREA:
  async deleteAlarm(jwtPayload: JwtPayloadType, alarmOId: string) {
    const where = '/client/userInfo/deleteAlarm'
    try {
      await this.portService.deleteAlarm(jwtPayload, alarmOId)
      return {ok: true, body: {}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
