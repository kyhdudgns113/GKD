import {Injectable} from '@nestjs/common'
import {JwtPayloadType, SetDocumentDataType} from '../../../common/types'
import {ClientPortService} from '../../../modules/database/ports/clientPort/clientPort.service'
import {LoggerService} from 'src/modules/logger/logger.service'

@Injectable()
export class ClientDocService {
  constructor(
    private loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  // AREA1: HTTP request
  async getDocument(jwtPayload: JwtPayloadType, clubOId: string) {
    const where = '/client/doc/getDocument'
    const {uOId} = jwtPayload
    try {
      const {contents} = await this.portService.getDocument(jwtPayload, clubOId)
      return {ok: true, body: {contents}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async setDocument(jwtPayload: JwtPayloadType, data: SetDocumentDataType) {
    const where = '/client/doc/setDocument'
    const {uOId} = jwtPayload
    try {
      const {clubOId} = data
      const gkdLog = `클럽:문서저장`
      const gkdStatus = {uOId, clubOId}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {contents} = await this.portService.setDocument(jwtPayload, data)
      return {ok: true, body: {contents}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
