import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'

@Injectable()
export class ClientAdminPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // GET AREA:

  /**
   * loadUserArr
   *  - 유저 배열을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - userArr: 유저 배열
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 유저 배열 조회 뙇!!
   *  3. 리턴 뙇!!
   */
  async loadUserArr(jwtPayload: T.JwtPayloadType) {
    const where = `/client/admin/loadUserArr`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 유저 배열 조회 뙇!!
      const {userArr} = await this.dbHubService.readUserArr(where)

      // 3. 리턴 뙇!!
      return {userArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
