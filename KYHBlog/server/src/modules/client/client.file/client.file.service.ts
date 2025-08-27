import {Injectable} from '@nestjs/common'
import {EditFileType, JwtPayloadType} from 'src/common/types'
import {ClientFilePortService} from '@module/database'

import * as U from '@common/utils'

@Injectable()
export class ClientFileService {
  constructor(private readonly portService: ClientFilePortService) {}

  // PUT AREA:

  async editFile(jwtPayload: JwtPayloadType, data: EditFileType) {
    /**
     * 파일 정보를 수정한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.editFile(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // GET AREA:

  async loadFile(fileOId: string) {
    /**
     * fileOId 파일의 정보를 읽어온다.
     */
    try {
      const {file} = await this.portService.loadFile(fileOId)
      return {ok: true, body: {file}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
