import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as V from '@values'
import * as T from '@common/types'

@Injectable()
export class ClientFilePortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // GET AREA:

  /**
   * loadFile
   *  - fileOId 파일의 정보를 읽어온다.
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 파일 조회 뙇!!
   *  2. 존재하지 않으면 에러 뙇!!
   *  3. 존재하면 파일 반환 뙇!!
   *
   * ------
   *
   * 리턴
   *  - file: 파일 정보(파일내용 포함)
   */
  async loadFile(fileOId: string) {
    const where = `/client/directory/loadFile`

    try {
      // 1. 파일 조회 뙇!!
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)

      if (!file) {
        throw {
          gkd: {fileOId: `존재하지 않는 파일`},
          gkdErrCode: 'CLIENTDIRPORT_loadFile_InvalidFileOId',
          gkdErrMsg: `존재하지 않는 파일`,
          gkdStatus: {fileOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
