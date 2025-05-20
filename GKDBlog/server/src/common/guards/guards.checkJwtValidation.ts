import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common'
import {GKDJwtService} from '../../modules/gkdJwt'
import {JwtPortService} from '../../modules/database/ports/jwtPort'
import {decodeJwtFromClient, getJwtFromHeader, jwtHeaderLenVali} from '../secret'
import {JwtPayloadType} from '../types'

@Injectable()
export class CheckJwtValidationGuard implements CanActivate {
  constructor(
    private readonly jwtService: GKDJwtService,
    private readonly portService: JwtPortService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest()
      const headers = request.headers
      const url = request.url
      const {jwtFromClient} = getJwtFromHeader(headers)

      const {header} = decodeJwtFromClient(jwtFromClient, jwtHeaderLenVali)
      const extractedPayload = await this.jwtService.verifyAsync(jwtFromClient, jwtHeaderLenVali)

      const {userId, userName, userOId, signUpType} = extractedPayload

      if (!url) {
        return false
      }

      if (this.jwtService.checkUOIdToHeaderToUrl(userOId, header) !== url) {
        // console.log(`좌 : ${this.jwtService.checkUOIdToHeaderToUrl(uOId, header)}`)
        // console.log(`우 : ${url}`)
        return false // Header 검증 실패
      }

      // 권한값 받아오기
      const {userAuth} = await this.portService.readUserAuthByUserId(userId)

      this.jwtService.resetUOIdToHeaderToUrl(userOId, header)

      // 새로운 JWT 생성
      const jwtPayload: JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }
      const {jwtFromServer} = await this.jwtService.signAsync(jwtPayload)

      headers.jwtFromServer = jwtFromServer
      headers.jwtFromClient = jwtFromClient
      headers.jwtPayload = jwtPayload
      headers.url = url
      headers.userAuth = userAuth

      // Jwt 인증 성공 시 true 반환
      return true
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      console.log(`Fucking error in /guard/checkValidation`)
      console.log(`ERR : ${errObj}`)
      return false
    }
  }
}
