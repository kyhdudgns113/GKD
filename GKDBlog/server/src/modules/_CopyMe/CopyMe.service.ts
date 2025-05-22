import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from 'src/common/types'
import {LoggerService} from 'src/modules/logger'

@Injectable()
export class CopyMeService {
  constructor(private readonly loggerService: LoggerService) {}

  async copyMePost(jwtPayload: JwtPayloadType, copyData: any) {
    const where = '/client/copyMePost'
    try {
      const gkdLog = 'copyMe:포스트'
      const gkdStatus = {copyData}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      return {ok: true, body: {}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async copyMeGet(jwtPayload: JwtPayloadType, testArg: any) {
    try {
      return {ok: true, body: {}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      return {ok: false, body: {}, errObj}
    }
  }
}
