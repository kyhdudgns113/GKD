import {Injectable} from '@nestjs/common'
import {ClientFilePortService} from '@module/database'
import {JwtPayloadType} from '@common/types'

import * as HTTP from '@httpDataTypes'
import * as U from '@common/utils'

@Injectable()
export class ClientFileService {
  constructor(private readonly portService: ClientFilePortService) {}

  // POST AREA:

  async addComment(jwtPayload: JwtPayloadType, data: HTTP.AddCommentType) {
    /**
     * 댓글을 추가한다.
     */
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.portService.addComment(jwtPayload, data)
      return {ok: true, body: {commentReplyArr, entireCommentReplyLen}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`    ${key}: ${errObj[key]}`)
      })
      return U.getFailResponse(errObj)
    }
  }

  async addReply(jwtPayload: JwtPayloadType, data: HTTP.AddReplyType) {
    /**
     * 대댓글을 추가한다.
     */
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.portService.addReply(jwtPayload, data)
      return {ok: true, body: {commentReplyArr, entireCommentReplyLen}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // PUT AREA:

  async editComment(jwtPayload: JwtPayloadType, data: HTTP.EditCommentType) {
    /**
     * 댓글을 수정한다.
     */
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.portService.editComment(jwtPayload, data)
      return {ok: true, body: {commentReplyArr, entireCommentReplyLen}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`    ${key}: ${errObj[key]}`)
      })
      return U.getFailResponse(errObj)
    }
  }

  async editFile(jwtPayload: JwtPayloadType, data: HTTP.EditFileType) {
    /**
     * 파일 정보를 수정한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.editFile(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async editFileStatus(jwtPayload: JwtPayloadType, data: HTTP.EditFileStatusType) {
    /**
     * 파일 상태를 수정한다.
     */
    try {
      const {extraDirs, extraFileRows, file} = await this.portService.editFileStatus(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows, file}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async editReply(jwtPayload: JwtPayloadType, data: HTTP.EditReplyType) {
    /**
     * 대댓글을 수정한다.
     */
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.portService.editReply(jwtPayload, data)
      return {ok: true, body: {commentReplyArr, entireCommentReplyLen}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // GET AREA:

  async loadComments(fileOId: string) {
    /**
     * fileOId 파일의 pageIdx 페이지의 댓글을 읽어온다.
     */
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.portService.loadComments(fileOId)
      return {ok: true, body: {commentReplyArr, entireCommentReplyLen}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadFile(fileOId: string) {
    /**
     * fileOId 파일의 정보를 읽어온다.
     */
    try {
      const {file, user} = await this.portService.loadFile(fileOId)
      return {ok: true, body: {file, user}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadNoticeFile() {
    /**
     * 공지 파일의 정보를 읽어온다.
     */
    try {
      const {file, user} = await this.portService.loadNoticeFile()
      return {ok: true, body: {file, user}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // DELETE AREA:

  async deleteComment(jwtPayload: JwtPayloadType, commentOId: string) {
    /**
     * commentOId 댓글을 삭제한다.
     */
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.portService.deleteComment(jwtPayload, commentOId)
      return {ok: true, body: {commentReplyArr, entireCommentReplyLen}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async deleteReply(jwtPayload: JwtPayloadType, replyOId: string) {
    /**
     * replyOId 대댓글을 삭제한다.
     */
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.portService.deleteReply(jwtPayload, replyOId)
      return {ok: true, body: {commentReplyArr, entireCommentReplyLen}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
