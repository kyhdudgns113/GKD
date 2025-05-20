import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common'
import {GKDJwtService} from 'src/modules/gkdJwt/gkdJwt.service'
import {decodeJwtFromClient, getJwtFromHeader, jwtHeaderLenVali} from '../secret'
import {JwtPayloadType} from '../types'

@Injectable()
export class CheckJwtValidationGuard implements CanActivate {
  constructor(private readonly jwtService: GKDJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest()
      const headers = request.headers
      const url = request.url
      const {jwtFromClient} = getJwtFromHeader(headers)

      const {header} = decodeJwtFromClient(jwtFromClient, jwtHeaderLenVali)
      const extractedPayload = await this.jwtService.verifyAsync(jwtFromClient, jwtHeaderLenVali)

      const uOId = extractedPayload.uOId

      if (!url) {
        return false
      }

      if (this.jwtService.checkUOIdToHeaderToUrl(uOId, header) !== url) {
        // console.log(`좌 : ${this.jwtService.checkUOIdToHeaderToUrl(uOId, header)}`)
        // console.log(`우 : ${url}`)
        return false // Header 검증 실패
      }

      this.jwtService.resetUOIdToHeaderToUrl(uOId, header)

      // 새로운 JWT 생성
      const jwtPayload: JwtPayloadType = {
        id: extractedPayload.id,
        uOId: extractedPayload.uOId
      }
      const {jwtFromServer} = await this.jwtService.signAsync(jwtPayload)

      headers.jwtFromServer = jwtFromServer
      headers.jwtFromClient = jwtFromClient
      headers.jwtPayload = jwtPayload
      headers.url = url

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
