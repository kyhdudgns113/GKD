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

  async addFile(jwtPayload: JwtPayloadType, data: HTTP.AddFileDataType) {
    const where = '/client/posting/addFile'
    try {
      const {fileName, parentDirOId} = data

      // 로깅 영역
      const gkdLog = 'posting:파일추가'
      const gkdStatus = {fileName, parentDirOId}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      // 요청 영역
      const {extraDirs, extraFileRows} = await this.portService.addFile(jwtPayload, data)

      // 응답 영역
      return {ok: true, body: {extraDirs, extraFileRows}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getDirectoryInfo(dirOId: string) {
    const where = '/client/posting/getDirectoryInfo'
    try {
      const {extraDirs, extraFileRows} = await this.portService.getDirectoryInfo(dirOId)
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

  async setDirName(jwtPayload: JwtPayloadType, data: HTTP.SetDirNameDataType) {
    const where = '/client/posting/setDirName'
    try {
      const {dirOId, newDirName} = data

      // 로깅 영역
      const gkdLog = 'posting:폴더이름변경'
      const gkdStatus = {dirOId, newDirName}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      // 요청 영역
      const {extraDirs, extraFileRows} = await this.portService.setDirName(jwtPayload, data)

      // 응답 영역
      return {ok: true, body: {extraDirs, extraFileRows}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
