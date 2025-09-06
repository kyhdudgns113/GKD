import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'
import * as U from '@utils'
import * as V from '@values'

@Injectable()
export class ClientUserPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // PUT AREA:

  /**
   * checkNewAlarm
   *  - 새로운 알림을 확인한다.
   *
   * ------
   *
   * 리턴
   *  - 없음
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 알람의 UOId 가 모두 같은지 췍!!
   *  2. 권한 췍!!
   *  3. 알림의 상태를 업데이트 뙇!!
   */
  async checkNewAlarm(jwtPayload: T.JwtPayloadType, data: HTTP.CheckNewAlarmType) {
    const where = `/client/user/checkNewAlarm`

    try {
      // 1. 알람의 UOId 가 모두 같은지 췍!!
      const {checkedAlarmArr} = data
      const isAllSame = checkedAlarmArr.every(alarm => alarm.userOId === checkedAlarmArr[0].userOId)
      if (!isAllSame) {
        throw {
          gkd: {notSame: `알람의 UOId 가 모두 같지 않음`},
          gkdErrCode: 'CLIENTUSERPORT_checkNewAlarm_notSame',
          gkdErrMsg: `알람의 UOId 가 모두 같지 않습니다.`,
          gkdStatus: {checkedAlarmArr},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2. 권한 췍!!
      await this.dbHubService.checkAuth_User(where, jwtPayload, checkedAlarmArr[0].userOId)

      // 3. 알림의 상태를 업데이트 뙇!!
      await this.dbHubService.updateAlarmStatusOld(where, checkedAlarmArr)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // GET AREA:

  /**
   * loadAlarmArr
   *  - userOId 유저의 알림 배열을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - alarmArr: 알림 배열
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *    - 관리자도 읽을 수 있다.
   *  2. 알림 배열 조회 뙇!!
   *  3. 리턴 뙇!!
   *
   * ------
   *
   * 리턴
   *  - alarmArr: 알림 배열
   */
  async loadAlarmArr(jwtPayload: T.JwtPayloadType, userOId: string) {
    const where = `/client/user/loadAlarmArr`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_User(where, jwtPayload, userOId)

      // 2. 알림 배열 조회 뙇!!
      const {alarmArr} = await this.dbHubService.readAlarmArrByUserOId(where, userOId)

      // 3. 리턴 뙇!!
      return {alarmArr}

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
