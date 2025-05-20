import {Injectable} from '@nestjs/common'
import {
  AddClubDataType,
  AddUserDataType,
  JwtPayloadType,
  ModifySelfInfoDataType,
  SetMemberInfoDataType,
  SetUserInfoDataType
} from 'src/common/types'
import {ClientPortService} from 'src/modules/database/ports/clientPort/clientPort.service'
import {LoggerService} from 'src/modules/logger/logger.service'

@Injectable()
export class ClientMainService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  /**
   * 탈퇴멤버 클럽은 여기서 만든다.
   */
  async addBanClub(jwtPayload: JwtPayloadType, data: AddClubDataType) {
    const where = `/client/main/addBanClub`
    const {uOId} = jwtPayload
    try {
      const {commOId, name} = data
      const gkdLog = `메인:탈퇴 클럽 생성`
      const gkdStatus = {uOId, commOId, name}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)

      const {comm} = await this.portService.addBanClubByMain(jwtPayload, data)
      return {ok: true, body: {comm}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  /**
   * 프론트에선 comm 에 저장된 순서를 우선순위로 생각한다.
   * 따라서 그것대로 정렬해야 한다.
   * 아싸리 정렬해서 넘겨주는게 맞다.
   * 탈퇴멤버 클럽은 여기서 안 만든다.
   */
  async addClub(jwtPayload: JwtPayloadType, data: AddClubDataType) {
    const {uOId} = jwtPayload
    const where = `/client/main/addClub`

    try {
      const {commOId, name} = data
      const gkdLog = `메인:클럽 생성`
      const gkdStatus = {uOId, commOId, name}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {clubsArr} = await this.portService.addClubByMain(jwtPayload, data)
      return {
        ok: true,
        body: {clubsArr},
        errObj: {}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async addUser(jwtPayload: JwtPayloadType, data: AddUserDataType) {
    const {uOId} = jwtPayload
    const where = `/client/main/addUser`
    try {
      const {commOId, id} = data
      const gkdLog = `메인:유저 추가.`
      const gkdStatus = {uOId, commOId, id}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {users} = await this.portService.addUserByMain(jwtPayload, data)
      return {ok: true, body: {users}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getDailyRecordsArr(jwtPayload: JwtPayloadType, memOId: string, range: number) {
    const where = `/client/main/getDailyRecordsArr`
    const {uOId} = jwtPayload
    try {
      const {dailyRecordsArr} = await this.portService.getDailyRecordsArr(jwtPayload, memOId, range)
      return {ok: true, body: {dailyRecordsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async getEntireMembers(jwtPayload: JwtPayloadType, commOId: string) {
    const where = `/client/main/getEntireMembers`
    const {uOId} = jwtPayload
    try {
      const {entireMembers, entireMembersArr, clubMembersArr} =
        await this.portService.getEntireMembers(jwtPayload, commOId)
      return {ok: true, body: {clubMembersArr, entireMembers, entireMembersArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async modifySelf(jwtPayload: JwtPayloadType, data: ModifySelfInfoDataType) {
    const {uOId} = jwtPayload
    const where = `/client/main/modifySelf`
    try {
      const {id} = data
      const gkdLog = `메인:자기 정보 변경`
      const gkdStatus = {uOId, newId: id}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {users} = await this.portService.modifySelf(jwtPayload, data)
      return {
        ok: true,
        body: {users},
        errObj: {}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async modifyUser(jwtPayload: JwtPayloadType, data: SetUserInfoDataType) {
    const {uOId} = jwtPayload
    const where = `/client/main/modifyUser`
    try {
      const {id, uOId: _uOId} = data
      const gkdLog = `메인:타인 정보 변경.`
      const gkdStatus = {uOId, targetUOId: _uOId, newId: id}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {users} = await this.portService.modifyUserByMain(jwtPayload, data)
      return {ok: true, body: {users}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async setMemberInfo(jwtPayload: JwtPayloadType, data: SetMemberInfoDataType) {
    const where = `/client/main/setMemberInfo`
    const {uOId} = jwtPayload
    try {
      const {commOId, memOId, name} = data
      const gkdLog = `메인:멤버정보 변경.`
      const gkdStatus = {uOId, commOId, memOId, newName: name}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {entireMembers, entireMembersArr, clubMembersArr} =
        await this.portService.setMemberInfo(jwtPayload, data)
      return {ok: true, body: {clubMembersArr, entireMembers, entireMembersArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
