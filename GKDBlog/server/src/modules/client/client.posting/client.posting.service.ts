import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from 'src/common/types'
import {ClientPortService} from 'src/modules/database'
import {LoggerService} from 'src/modules/logger'

import * as HTTP from 'src/common/types/httpDataTypes'

@Injectable()
export class ClientPostingService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  async addDirectory(jwtPayload: JwtPayloadType, data: HTTP.AddDirectoryDataType) {
    const where = '/client/posting/addDirectory'
    try {
      const {dirName, parentDirOId} = data

      // 로깅 영역
      const gkdLog = 'posting:폴더추가'
      const gkdStatus = {dirName, parentDirOId}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      // 요청 영역
      const {extraDirs, extraFileRows} = await this.portService.addDirectory(jwtPayload, data)

      // 응답 영역
      return {ok: true, body: {extraDirs, extraFileRows}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getRootDir() {
    const where = '/client/posting/getRootDir'
    try {
      // 로깅 영역
      const gkdLog = 'posting:루트디렉토리'
      const gkdStatus = {}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      // 요청 영역
      const {extraDirs, extraFileRows, rootDir} = await this.portService.getRootDir()

      // 응답 영역
      return {ok: true, body: {extraDirs, extraFileRows, rootDir}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
