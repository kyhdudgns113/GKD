import {Injectable} from '@nestjs/common'
import {ClientUserPortService} from '@module/database'
import {JwtPayloadType} from '@common/types'

import * as HTTP from '@httpDataTypes'
import * as U from '@common/utils'

@Injectable()
export class ClientUserService {
  constructor(private readonly portService: ClientUserPortService) {}

  // PUT AREA:

  async checkNewAlarm(jwtPayload: JwtPayloadType, data: HTTP.CheckNewAlarmType) {
    try {
      await this.portService.checkNewAlarm(jwtPayload, data)
      return {ok: true, body: {}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // GET AREA:

  async loadAlarmArr(jwtPayload: JwtPayloadType, userOId: string) {
    try {
      const {alarmArr} = await this.portService.loadAlarmArr(jwtPayload, userOId)
      return {ok: true, body: {alarmArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
