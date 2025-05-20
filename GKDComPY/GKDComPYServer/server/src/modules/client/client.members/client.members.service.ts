import {Injectable} from '@nestjs/common'
import {JwtPayloadType, SetEMemMatrixDataType} from 'src/common/types'
import {ClientPortService} from 'src/modules/database/ports/clientPort/clientPort.service'
import {LoggerService} from 'src/modules/logger/logger.service'

@Injectable()
export class ClientMembersService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  async getMembers(jwtPayload: JwtPayloadType, commOId: string) {
    const where = `/client/members/getMembers`
    const {uOId} = jwtPayload
    try {
      const {eMembersMatrix} = await this.portService.getMembersByMembers(jwtPayload, commOId)
      return {ok: true, body: {eMembersMatrix}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async loadMatrix(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/client/members/loadMatrix'
    const {uOId} = jwtPayload
    try {
      const {eMembersMatrix} = await this.portService.loadMatrix(jwtPayload, commOId)
      return {ok: true, body: {eMembersMatrix}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async saveMatrix(jwtPayload: JwtPayloadType, data: SetEMemMatrixDataType) {
    const where = `/client/members/saveMatrix`
    const {uOId} = jwtPayload
    try {
      const {commOId} = data
      const gkdLog = `전체멤버:저장.`
      const gkdStatus = {uOId, commOId}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      await this.portService.saveMatrix(jwtPayload, data)
      return {ok: true, body: {}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
