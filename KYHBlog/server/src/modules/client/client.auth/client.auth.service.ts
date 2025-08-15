import {Injectable} from '@nestjs/common'
import {ClientAuthPortService} from '@module/database'
import {GKDJwtService} from '@module/gkdJwt'

import * as HTTP from '@httpDataTypes'
import * as U from '@utils'
import * as T from '@common/types'

@Injectable()
export class ClientAuthService {
  constructor(
    private readonly portService: ClientAuthPortService,
    private readonly gkdJwtService: GKDJwtService
  ) {}

  async logIn(data: HTTP.LogInDataType) {
    const where = `/client/auth/logIn`
    const {userId} = data

    try {
      // 1. 로그인 기능 수행 뙇!!
      const {user} = await this.portService.logIn(data)
      const {userName, userOId, signUpType} = user

      // 2. JWT 생성 뙇!!
      const jwtPayload: T.JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }
      const {jwtFromServer} = await this.gkdJwtService.signAsync(jwtPayload)

      // 3. 성공 응답 뙇!!
      return {ok: true, body: {user}, gkdErrMsg: '', httpStatus: 200, jwtFromServer}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async signUp(data: HTTP.SignUpDataType) {
    const where = `/client/auth/signUp`
    const {userId, userName} = data

    try {
      // 1. 회원가입 기능 수행 뙇!!
      const {user} = await this.portService.signUp(data)
      const {userOId, signUpType} = user

      // 2. JWT 생성 뙇!!
      const jwtPayload: T.JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }
      const {jwtFromServer} = await this.gkdJwtService.signAsync(jwtPayload)

      // 3. 성공 응답 뙇!!
      return {ok: true, body: {user}, gkdErrMsg: '', httpStatus: 200, jwtFromServer}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
