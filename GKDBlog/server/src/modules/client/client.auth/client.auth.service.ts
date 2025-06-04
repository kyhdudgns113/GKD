import {Injectable} from '@nestjs/common'
import {ClientPortService} from 'src/modules/database'
import {GKDJwtService} from 'src/modules/gkdJwt'
import {LoggerService} from 'src/modules/logger'

import * as D from 'src/common/types/httpDataTypes'
import * as T from 'src/common/types/types'

/**
 * JWT 는 여기서 만든다.
 * - 나중에 port 모듈이랑 서비스가 분리될 수 있다.
 * - 그렇게 되면 jwt 모듈이랑 요청받는 모듈을 하나의 서비스로 두는게 합리적이다.
 * - port 모듈에서는 jwt 모듈에 접근할 수 없는 상태가 될 것이다.
 */
@Injectable()
export class ClientAuthService {
  constructor(
    private readonly jwtService: GKDJwtService,
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  // AREA1: 토큰 필요 없는 함수들
  /**
   * 로컬 로그인(ID, 비밀번호)
   *
   * @param data
   * @returns
   */
  async logIn(data: D.LogInDataType): Promise<T.ServiceReturnType> {
    const {userId, password} = data
    const where = '/client/auth/logIn'
    try {
      const gkdLog = 'auth:로컬로그인'
      const gkdStatus = {userId, password}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      const {user} = await this.portService.logIn(userId, password)
      const signUpType = 'local'
      const {userName, userOId} = user
      const jwtPayload: T.JwtPayloadType = {
        signUpType,
        userId,
        userName,
        userOId
      }
      const {jwtFromServer} = await this.jwtService.signAsync(jwtPayload)

      return {ok: true, body: {user}, errObj: {}, jwtFromServer}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      const logInId = userId
      await this.loggerService.createErrLog(where, '', errObj, logInId)
      return {ok: false, body: {}, errObj}
      // BLANK LINE COMMENT:
    }
  }

  /**
   * 로컬 회원가입(ID, 이름, 비밀번호)
   *
   * @param data
   * @returns
   */
  async signUp(data: D.SignUpDataType): Promise<T.ServiceReturnType> {
    const {userId, userName, password} = data
    const where = '/client/auth/signUp'
    try {
      const gkdLog = 'auth:로컬가입'
      const gkdStatus = {userId, userName}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      const {user} = await this.portService.signUp(userId, userName, password)
      const {userOId} = user
      const signUpType = 'local'

      const jwtPayload: T.JwtPayloadType = {
        signUpType,
        userId,
        userName,
        userOId
      }
      const {jwtFromServer} = await this.jwtService.signAsync(jwtPayload)

      return {ok: true, body: {user}, errObj: {}, jwtFromServer}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createGKDErrObj(where, '', errObj)
      return {ok: false, body: {}, errObj, jwtFromServer: ''}
      // BLANK LINE COMMENT:
    }
  }

  /**
   * 구글 회원가입 or 로그인 (ID, 이름, 사진)
   *
   * @returns
   *  - jwtFromServer
   *    - token 으로 redirect 를 해야하기 때문에 이것만 넘긴다.
   *    - redirect 전용 페이지에서 해당 토큰으로 유저정보를 불러온다.
   *    - redirect 페이지에서 refreshToken 등을 호출
   */
  async signUpGoogleCallback(userId: string, userName: string, picture: string): Promise<T.ServiceReturnType> {
    const where = '/client/auth/signUpGoogle'
    try {
      const gkdLog = 'auth:구글가입'
      const gkdStatus = {userId, userName, picture}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      const {userOId} = await this.portService.signUpOrLoginGoogle(userId, userName, picture)
      const signUpType = 'google'

      const jwtPayload: T.JwtPayloadType = {
        signUpType,
        userId,
        userName,
        userOId
      }
      const {jwtFromServer} = await this.jwtService.signAsync(jwtPayload)

      return {ok: true, body: {jwtFromServer}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
      // BLANK LINE COMMENT:
    }
  }

  // AREA2: 토큰 필요 있는 함수들

  /**
   * 이 함수는 토큰 재발급 안해도 된다.
   * - guard 가 알아서 재발급 해줌.
   * 해당 유저가 중간에 삭제되지는 않았나만 체크한다.
   */
  async refreshToken(jwtPayload: T.JwtPayloadType): Promise<T.ServiceReturnType> {
    const where = '/client/auth/refreshToken'
    try {
      const {user} = await this.portService.refreshToken(jwtPayload)
      return {ok: true, body: {user}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
      // BLANK LINE COMMENT:
    }
  }
}
