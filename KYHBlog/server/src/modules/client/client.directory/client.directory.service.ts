import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from 'src/common/types'
import * as U from '@common/utils'
import {ClientDirPortService} from '@module/database'

@Injectable()
export class ClientDirectoryService {
  constructor(private readonly portService: ClientDirPortService) {}

  async loadRootDirectory() {
    const where = `/client/directory/loadRootDirectory`

    /**
     * 루트 디렉토리의 정보를 요청한다.
     */
    try {
      const {rootDirOId, extraDirs, extraFileRows} = await this.portService.loadRootDirectory()

      return {ok: true, body: {rootDirOId, extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
