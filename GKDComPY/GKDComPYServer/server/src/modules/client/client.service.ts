import {Injectable} from '@nestjs/common'
import {GKDJwtService} from '../gkdJwt/gkdJwt.service'
import {JwtPayloadType, LogInDataType} from 'src/common/types'
import {ClientPortService} from '../database/ports/clientPort/clientPort.service'
import {LoggerService} from '../logger/logger.service'

@Injectable()
export class ClientService {
  constructor(
    private readonly jwtService: GKDJwtService,
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  async getUserCommInfo(jwtPayload: JwtPayloadType, _uOId: string) {
    const where = '/client/getUserCommInfo'
    const {uOId} = jwtPayload
    try {
      const {comm, users, clubsArr} = await this.portService.getUserCommInfo(jwtPayload, _uOId)
      return {ok: true, body: {comm, users, clubsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  /**
   * NOTE: 이 함수는 JWT 를 인자로 받지 못한다 ㅠㅠ
   */
  async logIn(data: LogInDataType) {
    const where = '/client/logIn'
    const uOId = ''
    try {
      const {id: _id} = data
      const gkdLog = `클라:로그인.`
      const gkdStatus = {id: _id}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus, _id)
      // BLANK LINE COMMENT:
      const {user} = await this.portService.logIn(data)
      const {id, uOId} = user

      if (!user) {
        throw {user: '왜 로그인때 User 가 null 일까. 그따구로 구현 안했는데'}
      }

      const jwtPayload: JwtPayloadType = {id, uOId}
      const {jwtFromServer} = await this.jwtService.signAsync(jwtPayload)

      return {
        ok: true,
        body: {id, uOId, jwtFromServer},
        errObj: {},
        jwtFromServer
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj, jwtFromServer: ''}
    }
  }

  // controller 에서 설명
  async setAllMemOId(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/client/setAllMemOId'
    const {uOId} = jwtPayload
    try {
      const gkdLog = `클라유틸:memOId 매핑 시도`
      const gkdStatus = {uOId, commOId}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      await this.portService.setAllMemOId(jwtPayload, commOId)
      return {ok: true, body: {yes: 'yesey'}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async onClickQuestion(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/client/onClickQuestion'
    const {uOId} = jwtPayload
    try {
      const gkdLog = `클라유틸:물어보기 클릭`
      const gkdStatus = {uOId}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)

      await this.portService.onClickQuestion(jwtPayload, commOId)
      // BLANK LINE COMMENT:
      return {ok: true, body: {yes: 'yesey'}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
