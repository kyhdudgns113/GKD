import {Injectable} from '@nestjs/common'
import {ClientAdminPortService} from '@module/database'

import * as U from '@utils'
import * as T from '@common/types'

@Injectable()
export class ClientAdminService {
  constructor(private readonly portService: ClientAdminPortService) {}

  // GET AREA:

  async loadUserArr(jwtPayload: T.JwtPayloadType) {
    try {
      const {userArr} = await this.portService.loadUserArr(jwtPayload)
      return {ok: true, body: {userArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
