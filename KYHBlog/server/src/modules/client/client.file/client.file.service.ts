import {Injectable} from '@nestjs/common'
import {AddCommentType, EditFileType, JwtPayloadType} from 'src/common/types'
import {ClientFilePortService} from '@module/database'

import * as U from '@common/utils'

@Injectable()
export class ClientFileService {
  constructor(private readonly portService: ClientFilePortService) {}

  // POST AREA:

  async addComment(jwtPayload: JwtPayloadType, data: AddCommentType) {
    /**
     * 댓글을 추가한다.
     */
    try {
      const {commentArr} = await this.portService.addComment(jwtPayload, data)
      return {ok: true, body: {commentArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`    ${key}: ${errObj[key]}`)
      })
      return U.getFailResponse(errObj)
    }
  }

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
      const {file, user} = await this.portService.loadFile(fileOId)
      return {ok: true, body: {file, user}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
