import {ClientPortService} from '@modules/database'
import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from 'src/common/types'
import {LoggerService} from 'src/modules/logger'
import {SocketGateway} from '@modules/socket/socket.gateway'

import * as HTTP from '@common/types/httpDataTypes'

@Injectable()
export class ClientReadingService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService,
    private readonly socketGateway: SocketGateway
  ) {}

  // POST AREA:
  async addComment(jwtPayload: JwtPayloadType, data: HTTP.AddCommentDataType) {
    const where = '/client/reading/addComment'
    try {
      const {content, fileOId, userOId} = data
      const {userName} = jwtPayload

      const gkdLog = 'reading:댓글추가'
      const gkdStatus = {content, fileOId, userOId, userName}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      const {comment, commentsArr, fileUserOId} = await this.portService.addComment(jwtPayload, data)

      // 댓글 알람 보내는 영역
      this.socketGateway.alarmReadingComment(fileUserOId, comment)

      return {ok: true, body: {commentsArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
      // ::
    }
  }

  async addReply(jwtPayload: JwtPayloadType, data: HTTP.AddReplyDataType) {
    const where = '/client/reading/addReply'
    try {
      const {commentOId, content, targetUserName, targetUserOId} = data
      const {userName} = jwtPayload

      const gkdLog = 'reading:대댓글추가'
      const gkdStatus = {commentOId, content, targetUserName, userName}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      const {commentsArr, reply} = await this.portService.addReply(jwtPayload, data)

      // 대댓글 알림 보내는 영역
      this.socketGateway.alarmReadingReply(targetUserOId, reply)

      return {ok: true, body: {commentsArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
      // ::
    }
  }

  // PUT AREA:
  async deleteReply(jwtPayload: JwtPayloadType, data: HTTP.DeleteReplyDataType) {
    const where = '/client/reading/deleteReply'
    const {userName, userOId} = jwtPayload
    try {
      const {commentOId, dateString} = data
      // 로깅 영역
      const gkdLog = 'reading:대댓글삭제'
      const gkdStatus = {commentOId, dateString, userName, userOId}
      await this.loggerService.createLog(where, userOId, gkdLog, gkdStatus)

      // 요청 및 응답 영역
      const {commentsArr} = await this.portService.deleteReply(jwtPayload, data)
      return {ok: true, body: {commentsArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, userOId, errObj)
      return {ok: false, body: {}, errObj}
      // ::
    }
  }

  async modifyComment(jwtPayload: JwtPayloadType, data: HTTP.ModifyCommentDataType) {
    const where = '/client/reading/modifyComment'
    try {
      const {commentOId, content} = data
      const {userName} = jwtPayload

      const gkdLog = 'reading:댓글수정'
      const gkdStatus = {commentOId, content, userName}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      const {commentsArr} = await this.portService.modifyComment(jwtPayload, data)

      return {ok: true, body: {commentsArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
      // ::
    }
  }

  async modifyReply(jwtPayload: JwtPayloadType, data: HTTP.ModifyReplyDataType) {
    const where = '/client/reading/modifyReply'
    try {
      const {commentOId, dateString, content} = data
      const {userName} = jwtPayload

      const gkdLog = 'reading:대댓글수정'
      const gkdStatus = {commentOId, dateString, content, userName}
      await this.loggerService.createLog(where, '', gkdLog, gkdStatus)

      const {commentsArr} = await this.portService.modifyReply(jwtPayload, data)

      return {ok: true, body: {commentsArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, '', errObj)
      return {ok: false, body: {}, errObj}
      // ::
    }
  }

  // GET AREA:
  async readCommentsArr(fileOId: string) {
    const where = '/client/reading/readCommentsArr'
    try {
      const {commentsArr} = await this.portService.readCommentsArr(fileOId)
      return {ok: true, body: {commentsArr}, errObj: {}}
    } catch (errObj) {
      // ::
      return {ok: false, body: {}, errObj}
    }
  }

  async readFile(fileOid: string) {
    const where = '/client/reading/readFile'
    try {
      const {file} = await this.portService.readFile(fileOid)
      // ::
      return {ok: true, body: {file}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      return {ok: false, body: {}, errObj}
    }
  }

  // DELETE AREA:
  async deleteComment(jwtPayload: JwtPayloadType, commentOId: string) {
    const where = '/client/reading/deleteComment'
    const {userName, userOId} = jwtPayload
    try {
      // 로깅 영역
      const gkdLog = 'reading:댓글삭제'
      const gkdStatus = {commentOId, userName, userOId}
      await this.loggerService.createLog(where, userOId, gkdLog, gkdStatus)

      // 요청 및 응답 영역
      const {commentsArr} = await this.portService.deleteComment(jwtPayload, commentOId)
      return {ok: true, body: {commentsArr}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      await this.loggerService.createErrLog(where, userOId, errObj)
      return {ok: false, body: {}, errObj}
    }
  }
}
