import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from '../../../common/types'
import {ClientPortService} from '../../../modules/database/ports/clientPort/clientPort.service'
import {LoggerService} from 'src/modules/logger/logger.service'

@Injectable()
export class ClientChatService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  // AREA1: HTTP request
  async getChatsArr(jwtPayload: JwtPayloadType, clubOId: string, firstIdx: number) {
    const where = '/client/chat/getChatsArr'
    const {uOId} = jwtPayload
    try {
      const {chatsArr, clubsArr} = await this.portService.getChatsArr(jwtPayload, clubOId, firstIdx)
      return {ok: true, body: {chatsArr, clubsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
