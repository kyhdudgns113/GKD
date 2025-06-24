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
