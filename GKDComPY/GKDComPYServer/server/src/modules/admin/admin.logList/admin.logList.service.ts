import {Injectable} from '@nestjs/common'
import {AddClubDataType, JwtPayloadType} from 'src/common/types'
import {AdminPortService} from 'src/modules/database/ports/adminPort/adminPort.service'
import {LoggerService} from 'src/modules/logger/logger.service'

@Injectable()
export class AdminLogListService {
  constructor(
    private readonly portService: AdminPortService,
    private readonly loggerService: LoggerService
  ) {}

  async getLogsArr(jwtPayload: JwtPayloadType) {
    const where = '/admin/logList/getLogsArr'
    const {uOId} = jwtPayload
    try {
      // BLANK LINE COMMENT:
      const {logsArr} = await this.portService.getLogsArr(jwtPayload)
      return {ok: true, body: {logsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async getUsers(jwtPayload: JwtPayloadType) {
    const where = `/admin/logList/getUsers`
    const {uOId} = jwtPayload
    try {
      const {users} = await this.portService.getUsersByLogService(jwtPayload)
      return {ok: true, body: {users}, errObj: {}}
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
