import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'
import * as U from '@utils'
import * as V from '@values'

@Injectable()
export class ClientFilePortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // PUT AREA:

  /**
   * editFile
   *   - fileOId 파일의 제목이나 내용을 수정한다.
   *
   * ------
   *
   * 순서
   *
   *   1. 권한 췍!!
   *   2. 파일 수정 뙇!!
   *   3. extraDirs, extraFileRows 추가 뙇!!
   *   4. 리턴 뙇!!
   */
  async editFile(jwtPayload: T.JwtPayloadType, data: HTTP.EditFileType) {
    const where = `/client/file/editFile`

    const {fileOId, fileName, content} = data

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 파일 수정 뙇!!
      const {directoryArr, fileRowArr} = await this.dbHubService.updateFileNameContent(where, fileOId, fileName, content)

      // 3. extraDirs, extraFileRows 추가 뙇!!
      const extraDirs = V.NULL_extraDirs()
      const extraFileRows = V.NULL_extraFileRows()

      U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      // 4. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

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
   *  3. 파일의 유저정보 조회 뙇!!
   *     - 존재하지 않으면 NULL USER 반환
   *     - 유저가 삭제되었어도 파일정보는 불러와야 한다.
   *  4. 파일과 유저 반환 뙇!!
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

      // 2. 존재하지 않으면 에러 뙇!!
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

      // 3. 파일의 유저정보 조회 뙇!!
      const {user} = await this.dbHubService.readUserByUserOId(where, file.userOId)

      if (!user) {
        return {file, user: V.NULL_User()}
      }

      // 4. 파일과 유저 반환 뙇!!
      return {file, user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
