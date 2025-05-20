import {Injectable} from '@nestjs/common'
import {
  AddClubDataType,
  AddCommDataType,
  AddUserDataType,
  ChangeCommNameDataType,
  JwtPayloadType,
  SetCommAuthDataType,
  SetCommMaxClubsDataType,
  SetCommMaxUsersDataType
} from 'src/common/types'
import {AdminPortService} from 'src/modules/database/ports/adminPort/adminPort.service'
import {LoggerService} from 'src/modules/logger/logger.service'

@Injectable()
export class AdminCommunityService {
  constructor(
    private readonly portService: AdminPortService,
    private readonly loggerService: LoggerService
  ) {}

  async addBanClub(jwtPayload: JwtPayloadType, data: AddClubDataType) {
    const isLogging = false
    const where = '/admin/community/addBanClub'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const {commOId, name} = data
        const gkdLog = `관리자:탈퇴 클럽 생성.`
        const gkdStatus = {uOId, commOId, name}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      const {comms} = await this.portService.addBanClub(jwtPayload, data)
      return {ok: true, body: {comms}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async addClub(jwtPayload: JwtPayloadType, data: AddClubDataType) {
    const isLogging = false
    const where = '/admin/community/addClub'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const {name} = data
        const gkdLog = `관리자:클럽생성.`
        const gkdStatus = {uOId, name}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      const {clubsArr} = await this.portService.addClub(jwtPayload, data)
      return {ok: true, body: {clubsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async addComm(jwtPayload: JwtPayloadType, data: AddCommDataType) {
    const isLogging = false
    const where = '/admin/community/addComm'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const {name} = data
        const gkdLog = `관리자:공동체 생성.`
        const gkdStatus = {uOId, name}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      const {comms} = await this.portService.addComm(jwtPayload, data)
      return {ok: true, body: {comms}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async addUser(jwtPayload: JwtPayloadType, data: AddUserDataType) {
    const isLogging = false
    const where = '/admin/community/addUser'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const {commOId, id} = data
        const gkdLog = `관리자:유저 생성.`
        const gkdStatus = {uOId, id, commOId}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      const {commUsersArr} = await this.portService.addUserByCommService(jwtPayload, data)
      return {ok: true, body: {commUsersArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async changeName(jwtPayload: JwtPayloadType, data: ChangeCommNameDataType) {
    const isLogging = false
    const where = '/admin/community/changeName'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const {commOId, name} = data
        const gkdLog = `관리자:공동체 이름변경.`
        const gkdStatus = {uOId, commOId, name}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      const {comms} = await this.portService.changeCommName(jwtPayload, data)
      return {ok: true, body: {comms}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async deleteClub(jwtPayload: JwtPayloadType, commOId: string, clubOId: string) {
    const isLogging = false
    const where = '/admin/community/deleteClub'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const gkdLog = `관리자:클럽삭제.`
        const gkdStatus = {uOId, commOId, clubOId}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      // 특정 community 만 업데이트를 할 수 없다.
      const {comms} = await this.portService.deleteClubFromAdmin(
        jwtPayload,

        commOId,
        clubOId
      )
      return {ok: true, body: {comms}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async deleteUser(jwtPayload: JwtPayloadType, commOId: string, _uOId: string) {
    const isLogging = false
    const where = '/admin/community/deleteUser'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const gkdLog = `관리자:유저삭제.`
        const gkdStatus = {uOId, commOId, targetUOId: _uOId}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      // 특정 community 만 업데이트를 할 수 없다.
      const {comms} = await this.portService.deleteUserFromAdmin(jwtPayload, commOId, _uOId)
      return {ok: true, body: {comms}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getClubsArr(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/admin/community/getClubsArr'
    const {uOId} = jwtPayload
    try {
      // BLANK LINE COMMENT:
      const {clubsArr} = await this.portService.getClubsArr(jwtPayload, commOId)
      return {ok: true, body: {clubsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async getComms(jwtPayload: JwtPayloadType) {
    const where = '/admin/community/getComms'
    const {uOId} = jwtPayload
    try {
      const {comms} = await this.portService.getComms(jwtPayload)
      return {ok: true, body: {comms}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async getUsers(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/admin/community/getUsers'
    const {uOId} = jwtPayload
    try {
      const {commUsersArr} = await this.portService.getCommUsersArr(jwtPayload, commOId)

      return {ok: true, body: {commUsersArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async setCommMaxClubs(jwtPayload: JwtPayloadType, data: SetCommMaxClubsDataType) {
    const isLogging = false
    const where = `/admin/community/setCommMaxClubs`
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const {commOId, maxClubs} = data
        const gkdLog = `관리자:공동체 클럽수 변경.`
        const gkdStatus = {uOId, commOId, maxClubs}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      const {comms} = await this.portService.setCommMaxClubs(jwtPayload, data)
      return {ok: true, body: {comms}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async setCommMaxUsers(jwtPayload: JwtPayloadType, data: SetCommMaxUsersDataType) {
    const isLogging = false
    const where = `/admin/community/setCommMaxUsers`
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const {commOId, maxUsers} = data
        const gkdLog = `관리자:공동체 유저수 변경.`
        const gkdStatus = {uOId, commOId, maxUsers}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      const {comms} = await this.portService.setCommMaxUsers(jwtPayload, data)
      return {ok: true, body: {comms}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async setUserAuthVal(jwtPayload: JwtPayloadType, data: SetCommAuthDataType) {
    const isLogging = false
    const where = '/admin/community/setUserAuthVal'
    const {uOId} = jwtPayload
    try {
      if (isLogging) {
        const {commOId, uOId: _uOId, authVal} = data
        const gkdLog = `관리자:유저권한 변경`
        const gkdStatus = {commOId, uOId, targetUOId: _uOId, authVal}
        await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // BLANK LINE COMMENT:
      const {comms} = await this.portService.setUserCommAuthByCommService(jwtPayload, data)
      return {ok: true, body: {comms}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
