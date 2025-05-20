import {Injectable} from '@nestjs/common'
import {AddUserDataType, JwtPayloadType, SetCommAuthDataType} from 'src/common/types'
import {AdminPortService} from 'src/modules/database/ports/adminPort/adminPort.service'
import {LoggerService} from 'src/modules/logger/logger.service'

/**
 * // NOTE: 제발 여기서 로직 짜지마
 */
@Injectable()
export class AdminUserListService {
  constructor(
    private readonly portService: AdminPortService,
    private readonly loggerService: LoggerService
  ) {}

  async addUser(jwtPayload: JwtPayloadType, data: AddUserDataType) {
    const isLogging = false
    const where = '/admin/userList/addUser'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        try {
          const {id, commOId} = data
          const gkdLog = `관리자:유저 생성.`
          const gkdStatus = {uOId, commOId, id}
          await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
          // BLANK LINE COMMENT:
        } catch (errObj) {}
      }
      // BLANK LINE COMMENT:
      const {users} = await this.portService.addUserByUserService(jwtPayload, data)
      return {ok: true, body: {users}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getAuthVal(jwtPayload: JwtPayloadType, commOId: string, _uOId: string) {
    const where = '/admin/userList/getAuthVal'
    const {uOId} = jwtPayload
    try {
      // BLANK LINE COMMENT:
      const {authVal} = await this.portService.getAuthValByUserService(jwtPayload, commOId, _uOId)
      return {ok: true, body: {authVal}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async getCommName(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/admin/userList/getCommName'
    const {uOId} = jwtPayload
    try {
      const {commName} = await this.portService.getCommNameByUserService(jwtPayload, commOId)
      return {ok: true, body: {commName}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async getCommsRows(jwtPayload: JwtPayloadType) {
    const where = '/admin/userList/getCommsRows'
    const {uOId} = jwtPayload
    try {
      const {commsRowsArr} = await this.portService.getCommsRows(jwtPayload)
      return {ok: true, body: {commsRowsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async getUsers(jwtPayload: JwtPayloadType) {
    const where = '/admin/userList/getUsers'
    const {uOId} = jwtPayload
    try {
      const {users} = await this.portService.getUsersByUserService(jwtPayload)
      return {ok: true, body: {users}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async setUserCommAuth(jwtPayload: JwtPayloadType, data: SetCommAuthDataType) {
    const isLogging = false
    const where = '/admin/userList/setUserCommAuth'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        try {
          const {authVal, commOId, uOId: _uOId} = data
          const gkdLog = `관리자:유저권한 변경.`
          const gkdStatus = {uOId, commOId, targetUOId: _uOId, authVal}
          await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
          // BLANK LINE COMMENT:
        } catch (errObj) {}
      }
      // BLANK LINE COMMENT:
      const {users} = await this.portService.setUserCommAuthByUserService(jwtPayload, data)
      return {ok: true, body: {users}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
