import {Injectable} from '@nestjs/common'
import {
  AddMemberDataType,
  ChangeMemClubDataType,
  JwtPayloadType,
  SetCardInfoDataType,
  SetMemberCommentDataType,
  SetMemberPosDataType,
  SetMemberPowerDataType
} from 'src/common/types'
import {ClientPortService} from 'src/modules/database/ports/clientPort/clientPort.service'
import {LoggerService} from 'src/modules/logger/logger.service'

@Injectable()
export class ClientClubService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  async addMemberReq(jwtPayload: JwtPayloadType, data: AddMemberDataType) {
    const {uOId} = jwtPayload
    const where = '/client/club/addMemberReq'
    try {
      const {clubOId, commOId, name} = data
      const gkdLog = `클럽:멤버 생성.`
      const gkdStatus = {uOId, commOId, clubOId, name}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {members} = await this.portService.addMemberReqByClub(jwtPayload, data)
      return {ok: true, body: {members, legacyMembersArr: []}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async changeMemClub(jwtPayload: JwtPayloadType, data: ChangeMemClubDataType) {
    const {uOId} = jwtPayload
    const where = '/client/club/changeMemClub'
    try {
      const {clubOId, memOId} = data
      const gkdLog = `클럽:멤버 클럽 이동.`
      const gkdStatus = {uOId, memOId, clubOId}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {members} = await this.portService.changeMemClub(jwtPayload, data)
      return {ok: true, body: {members}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async deleteClubMember(jwtPayload: JwtPayloadType, clubOId: string, memOId: string) {
    const {uOId} = jwtPayload
    const where = '/client/club/deleteClubMember'
    try {
      const gkdLog = `클럽:멤버 삭제.`
      const gkdStatus = {uOId, clubOId, memOId}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {members} = await this.portService.deleteClubMember(jwtPayload, clubOId, memOId)
      return {ok: true, body: {members}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getMemberRecordsArr(jwtPayload: JwtPayloadType, memOId: string, dateRange: number) {
    const where = '/client/club/getMemberRecordsArr'
    const {uOId} = jwtPayload
    try {
      const {dailyRecordsArr, end} = await this.portService.getMemberRecordsArr(
        jwtPayload,
        memOId,
        dateRange
      )
      return {ok: true, body: {dailyRecordsArr, end}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async getMembers(jwtPayload: JwtPayloadType, clubOId: string) {
    const {uOId} = jwtPayload
    const where = '/client/club/getMembers'
    try {
      const {members} = await this.portService.getMembersByClub(jwtPayload, clubOId)
      return {ok: true, body: {members}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async setCardInfo(jwtPayload: JwtPayloadType, data: SetCardInfoDataType) {
    const {uOId} = jwtPayload
    const where = '/client/club/setCardInfo'
    try {
      // BLANK LINE COMMENT:
      const {members} = await this.portService.setCardInfo(jwtPayload, data)
      return {ok: true, body: {members}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async setMemComment(jwtPayload: JwtPayloadType, data: SetMemberCommentDataType) {
    const {uOId} = jwtPayload
    const where = '/client/club/setMemComment'
    try {
      const {clubOId, memberComment, memOId} = data
      const gkdLog = `클럽:멤버 코멘트 변경.`
      const gkdStatus = {uOId, clubOId, memOId, memberComment}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {members} = await this.portService.setMemComment(jwtPayload, data)
      return {ok: true, body: {members}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async setMemPos(jwtPayload: JwtPayloadType, data: SetMemberPosDataType) {
    const {uOId} = jwtPayload
    const where = '/client/club/setMemPos'
    try {
      const {members} = await this.portService.setMemPos(jwtPayload, data)
      return {ok: true, body: {members}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async setMemPower(jwtPayload: JwtPayloadType, data: SetMemberPowerDataType) {
    const {uOId} = jwtPayload
    const where = '/client/club/setMemPower'
    try {
      const {members} = await this.portService.setMemPowerByClubMember(jwtPayload, data)
      return {ok: true, body: {members}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
