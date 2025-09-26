import {DBHubService} from '../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'
import * as U from '@utils'
import * as V from '@values'

@Injectable()
export class LoggerPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  async loggingMessage(where: string, gkdLog: string, userOId: string, gkdStatus: any) {
    where = where + '/loggingMessage'
    try {
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)

      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'LOGGERPORT_loggingMessage_noUser',
          gkdErrMsg: `유저가 없습니다.`,
          gkdStatus: {userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const {userId, userName} = user

      const dto: DTO.CreateLogDTO = {
        errObj: {},
        gkd: {},
        gkdErr: '',
        userId,
        userName,
        gkdLog,
        userOId,
        gkdStatus,
        where
      }
      const {log} = await this.dbHubService.createLog(where, dto)
      return {log}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async loggingError(where: string, errObj: any, userOId: string) {
    where = where + '/loggingError'
    try {
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)

      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'LOGGERPORT_loggingError_noUser',
          gkdErrMsg: `유저가 없습니다.`,
          gkdStatus: {userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const {userId, userName} = user

      const dto: DTO.CreateLogDTO = {
        errObj,
        gkd: errObj.gkd || {},
        gkdErr: errObj.gkdErr || '',
        userId,
        userName,
        gkdStatus: errObj.gkdStatus || {},
        gkdLog: errObj.gkdLog || '',
        userOId,
        where
      }
      const {log} = await this.dbHubService.createLog(where, dto)
      return {log}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
