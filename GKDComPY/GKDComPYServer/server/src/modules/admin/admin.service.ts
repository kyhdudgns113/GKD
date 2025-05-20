import {Injectable} from '@nestjs/common'
import {GKDJwtService} from '../gkdJwt/gkdJwt.service'
import {JwtPayloadType, LogInDataType, SignUpDataType} from 'src/common/types'
import {AdminPortService} from '../database/ports/adminPort/adminPort.service'
import {LoggerService} from '../logger/logger.service'

@Injectable()
export class AdminService {
  constructor(
    private readonly jwtService: GKDJwtService,
    private readonly loggerService: LoggerService,
    private readonly portService: AdminPortService
  ) {}

  /**
   * NOTE: 이 함수는 JWT 를 인자로 받지 못한다 ㅠㅠ
   */
  async logIn(data: LogInDataType) {
    const where = '/admin/logIn'
    const uOId = ''
    try {
      if (data.id !== 'GKD_Master') {
        const {id} = data
        const gkdLog = `관리자: 로그인.`
        const gkdStatus = {id}
        await this.loggerService.createLog(where, '', gkdLog, gkdStatus)
        // BLANK LINE COMMENT:
      }
      // BLANK LINE COMMENT:
      const {user} = await this.portService.logIn(data)
      if (!user) {
        throw {
          gkd: {user: '왜 로그인때 User 가 null 일까. 그따구로 구현 안했는데'},
          gkdStatus: {id: data.id},
          where
        }
      }

      const {id, uOId} = user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const {jwtFromServer} = await this.jwtService.signAsync(jwtPayload)

      return {ok: true, body: {id, uOId, errObj: {}}, jwtFromServer}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj, jwtFromServer: ''}
      // BLANK LINE COMMENT:
    }
  }

  /**
   * @returns body 로 아무것도 전달해주지 않는다.
   */
  async signUp(data: SignUpDataType) {
    const where = '/admin/signUp'
    const uOId = ''
    try {
      const {id: _id} = data
      const gkdLog = `관리자: 아이디 생성 시도.`
      const gkdStatus = {id: _id}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {id, password} = data
      const commOId = 'admin'
      // 인자 에러 처리
      if (!id) throw {gkd: {id: 'ID 가 왜 비어있는채로 오냐'}, gkdStatus: {id}, where}
      if (!password) throw {gkd: {password: '비번이 왜 비어있는채로 오냐'}, gkdStatus: {id}, where}

      await this.portService.signUp(data)

      return {ok: true, body: {}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
      // BLANK LINE COMMENT:
    }
  }
}
