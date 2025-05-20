import {Injectable} from '@nestjs/common'
import {
  AddNextWeekDataType,
  AddPrevWeekDataType,
  AddRowMemberDataType,
  DeleteRowMemDataType,
  DeleteWeekRowDataType,
  JwtPayloadType,
  SetCommentDataType,
  SetDailyRecordType,
  SetRowMemberDataType,
  SetTHeadDataType,
  SetWeeklyCommentDataType
} from 'src/common/types'
import {ClientPortService} from 'src/modules/database/ports/clientPort/clientPort.service'
import {LoggerService} from 'src/modules/logger/logger.service'

@Injectable()
export class ClientRecordService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  async addNextWeek(jwtPayload: JwtPayloadType, data: AddNextWeekDataType) {
    const {uOId} = jwtPayload
    const where = '/client/record/addNextWeek'
    try {
      const {clubOId} = data
      const gkdLog = `대전기록:다음 주차 추가`
      const gkdStatus = {uOId, clubOId}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, data)
      return {ok: true, body: {weekRowsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async addPrevWeek(jwtPayload: JwtPayloadType, data: AddPrevWeekDataType) {
    const {uOId} = jwtPayload
    const where = '/client/record/addPrevWeek'
    try {
      const {clubOId} = data
      const gkdLog = `대전기록:이전 주차 추가`
      const gkdStatus = {uOId, clubOId}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {weekRowsArr} = await this.portService.addPrevWeek(jwtPayload, data)
      return {ok: true, body: {weekRowsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async addRowMember(jwtPayload: JwtPayloadType, data: AddRowMemberDataType) {
    const {uOId} = jwtPayload
    const where = '/client/record/addRowMember'
    try {
      const {name, weekOId} = data
      const gkdLog = `대전기록:대전 기록 멤버 추가`
      const gkdStatus = {uOId, weekOId, name}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {recordsArr, weeklyRecord} = await this.portService.addRowMember(jwtPayload, data)
      return {ok: true, body: {recordsArr, weeklyRecord}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async deleteRowMember(jwtPayload: JwtPayloadType, data: DeleteRowMemDataType) {
    const {uOId} = jwtPayload
    const where = '/client/record/deleteRowMember'
    try {
      const {name, weekOId} = data
      const gkdLog = `대전기록:대전 기록 멤버 삭제`
      const gkdStatus = {uOId, weekOId, name}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {recordsArr, weeklyRecord} = await this.portService.deleteRowMember(jwtPayload, data)
      return {ok: true, body: {recordsArr, weeklyRecord}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async deleteWeekRow(jwtPayload: JwtPayloadType, data: DeleteWeekRowDataType) {
    const {uOId} = jwtPayload
    const where = '/client/record/deleteWeekRow'
    try {
      const {clubOId, weekOId} = data
      const gkdLog = `대전기록:주차 삭제`
      const gkdStatus = {uOId, clubOId, weekOId}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {weekRowsArr} = await this.portService.deleteWeekRow(jwtPayload, data)
      return {ok: true, body: {weekRowsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async getWeeklyRecord(jwtPayload: JwtPayloadType, weekOId: string) {
    const {uOId} = jwtPayload
    const where = '/client/record/getWeeklyRecord'
    try {
      const {recordsArr, weeklyRecord} = await this.portService.getWeeklyRecord(jwtPayload, weekOId)
      return {ok: true, body: {recordsArr, weeklyRecord}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async getWeekRowsArr(jwtPayload: JwtPayloadType, clubOId: string) {
    const {uOId} = jwtPayload
    const where = '/client/record/getWeekRowsArr'
    try {
      const {weekRowsArr} = await this.portService.getWeekRowsArr(jwtPayload, clubOId)
      return {ok: true, body: {weekRowsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }

  async setComments(jwtPayload: JwtPayloadType, data: SetCommentDataType) {
    const {uOId} = jwtPayload
    const where = '/client/record/setComments'
    try {
      const {comments, dayIdx, weekOId} = data
      const gkdLog = `대전기록:일간 코멘트 변경`
      const gkdStatus = {uOId, weekOId, dayIdx, comments}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {weeklyRecord} = await this.portService.setComments(jwtPayload, data)
      return {ok: true, body: {weeklyRecord}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async setRowMember(jwtPayload: JwtPayloadType, data: SetRowMemberDataType) {
    const {uOId} = jwtPayload
    const where = '/client/record/setRowMember'
    try {
      const {weekOId, memOId, prevName, name} = data
      const gkdLog = `대전기록:대전 기록 멤버 변경`
      const gkdStatus = {uOId, weekOId, memOId, prevName, name}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {recordsArr, weeklyRecord} = await this.portService.setRowMember(jwtPayload, data)
      return {ok: true, body: {recordsArr, weeklyRecord}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async setTHead(jwtPayload: JwtPayloadType, data: SetTHeadDataType) {
    const {uOId} = jwtPayload
    const where = '/client/record/setTHead'
    try {
      const {clubOId, dateIdx, weekOId} = data
      const gkdLog = `대전기록:일자 정보 변경`
      const gkdStatus = {uOId, clubOId, weekOId, dateIdx}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {weeklyRecord} = await this.portService.setTHead(jwtPayload, data)
      return {ok: true, body: {weeklyRecord}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async setWeeklyComment(jwtPayload: JwtPayloadType, data: SetWeeklyCommentDataType) {
    const where = '/client/record/setWeeklyComment'
    const {uOId} = jwtPayload
    try {
      const {weekOId, comment} = data
      const gkdLog = `대전기록:주간 코멘트 변경`
      const gkdStatus = {uOId, weekOId, comment}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {weeklyRecord} = await this.portService.setWeeklyComment(jwtPayload, data)
      return {ok: true, body: {weeklyRecord}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
  async submitRecord(jwtPayload: JwtPayloadType, data: SetDailyRecordType) {
    const {uOId} = jwtPayload
    const where = '/client/record/submitRecord'
    try {
      const {clubOId, date, name} = data
      const gkdLog = `대전기록:기록 작성.`
      const gkdStatus = {uOId, clubOId, date, name}
      await this.loggerService.createLog(where, uOId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
      const {recordsArr} = await this.portService.submitRecord(jwtPayload, data)
      return {ok: true, body: {recordsArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      await this.loggerService.createErrLog(where, uOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
