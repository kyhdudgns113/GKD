import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common'
import {GKDJwtService} from 'src/modules/gkdJwt/gkdJwt.service'
import {decodeJwtFromClient, getJwtFromHeader, jwtHeaderLenVali} from '../secret'
import {JwtPayloadType} from '../types'
import {JwtPortService} from 'src/modules/database/ports/jwtPort/jwtPort.service'

@Injectable()
export class CheckAdminGuard implements CanActivate {
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

      const uOId = extractedPayload.uOId

      if (!url) {
        return false
      }

      if (this.jwtService.checkUOIdToHeaderToUrl(uOId, header) !== url) {
        return false // Header 검증 실패
      }

      await this.portService.checkUserAdmin(uOId)

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

      // Jwt 인증 성공 시 true 반환
      return true
    } catch (errObj) {
      // console.log(`ERR IS ${err}`)
      // Object.keys(err).forEach(key => {
      //   console.log(`${key} => ${err.key}`)
      // })
      // return false
      throw errObj
    }
  }
}
