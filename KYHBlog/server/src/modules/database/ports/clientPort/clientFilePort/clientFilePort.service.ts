import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'
import * as U from '@utils'
import * as V from '@values'

@Injectable()
export class ClientFilePortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // POST AREA:

  async addComment(jwtPayload: T.JwtPayloadType, data: HTTP.AddCommentType) {
    const where = `/client/file/addComment`

    const {content, fileOId, userName, userOId} = data

    /**
     * {userName, userOId} 유저가 fileOId 파일에 댓글을 추가한다.
     *
     * ------
     *
     * 순서
     *
     *   1. 권한 췍!!
     *   2. 댓글 추가 뙇!!
     *   3. 리턴용 댓글 배열 뙇!!
     *   4. 리턴 뙇!!
     */
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthUser(where, jwtPayload)

      // 2. 댓글 추가 뙇!!
      const dto: DTO.CreateCommentDTO = {
        content,
        fileOId,
        userName,
        userOId
      }
      await this.dbHubService.createComment(where, dto)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByFileOId(where, fileOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async addReply(jwtPayload: T.JwtPayloadType, data: HTTP.AddReplyType) {
    const where = `/client/file/addReply`

    const {commentOId, content, targetUserOId, targetUserName, userName, userOId} = data

    /**
     * {userName, userOId} 유저가 commentOId 댓글에 대댓글을 추가한다.
     *   - 대댓글 대상 유저는 {targetUserOId, targetUserName} 이다.
     *
     * ------
     *
     * 리턴
     *
     *   - commentReplyArr: 전송할 댓글 배열
     *   - entireCommentReplyLen: 전체 댓글 개수
     *
     * ------
     *
     * 순서
     *
     *   1. 권한 췍!!
     *   2. 대댓글 추가 뙇!!
     *   3. 리턴용 댓글 배열 뙇!!
     *   4. 리턴 뙇!!
     */

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthUser(where, jwtPayload)

      // 2. 대댓글 추가 뙇!!
      const dto: DTO.CreateReplyDTO = {
        commentOId,
        content,
        targetUserOId,
        targetUserName,
        userName,
        userOId
      }
      await this.dbHubService.createReply(where, dto)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByCommentOId(where, commentOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // PUT AREA:

  async editComment(jwtPayload: T.JwtPayloadType, data: HTTP.EditCommentType) {
    const where = `/client/file/editComment`

    const {commentOId, newContent} = data

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_Comment(where, jwtPayload, commentOId)

      // 2. 댓글 수정 뙇!!
      await this.dbHubService.updateComment(where, commentOId, newContent)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByCommentOId(where, commentOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * editFile
   *   - fileOId 파일의 제목이나 내용을 수정한다.
   *
   * ------
   *
   * 순서
   *
   *   1. 권한 췍!!
   *   2. 파일 수정 뙇!!
   *   3. extraDirs, extraFileRows 추가 뙇!!
   *   4. 리턴 뙇!!
   */
  async editFile(jwtPayload: T.JwtPayloadType, data: HTTP.EditFileType) {
    const where = `/client/file/editFile`

    const {fileOId, fileName, content} = data

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 파일 수정 뙇!!
      const {directoryArr, fileRowArr} = await this.dbHubService.updateFileNameContent(where, fileOId, fileName, content)

      // 3. extraDirs, extraFileRows 추가 뙇!!
      const extraDirs = V.NULL_extraDirs()
      const extraFileRows = V.NULL_extraFileRows()

      U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      // 4. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async editReply(jwtPayload: T.JwtPayloadType, data: HTTP.EditReplyType) {
    const where = `/client/file/editReply`

    const {replyOId, newContent} = data

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_Reply(where, jwtPayload, replyOId)

      // 2. 대댓글 수정 뙇!!
      await this.dbHubService.updateReplyContent(where, replyOId, newContent)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByReplyOId(where, replyOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // GET AREA:

  /**
   * loadComments
   *  - fileOId 파일의 pageIdx 페이지의 댓글을 읽어온다.
   *
   * ------
   *
   * 리턴
   *   - commentArr: 전송할 댓글 배열
   *   - entireCommentLen: 전체 댓글 개수
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 댓글 조회 뙇!!
   *  2. 리턴 뙇!!
   */
  async loadComments(fileOId: string) {
    const where = `/client/file/loadComments`

    try {
      // 1. 댓글 조회 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByFileOId(where, fileOId)

      // 2. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * loadFile
   *  - fileOId 파일의 정보를 읽어온다.
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 파일 조회 뙇!!
   *  2. 존재하지 않으면 에러 뙇!!
   *  3. 파일의 유저정보 조회 뙇!!
   *     - 존재하지 않으면 NULL USER 반환
   *     - 유저가 삭제되었어도 파일정보는 불러와야 한다.
   *  4. 파일과 유저 반환 뙇!!
   *
   * ------
   *
   * 리턴
   *  - file: 파일 정보(파일내용 포함)
   */
  async loadFile(fileOId: string) {
    const where = `/client/directory/loadFile`

    try {
      // 1. 파일 조회 뙇!!
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)

      // 2. 존재하지 않으면 에러 뙇!!
      if (!file) {
        throw {
          gkd: {fileOId: `존재하지 않는 파일`},
          gkdErrCode: 'CLIENTDIRPORT_loadFile_InvalidFileOId',
          gkdErrMsg: `존재하지 않는 파일`,
          gkdStatus: {fileOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 3. 파일의 유저정보 조회 뙇!!
      const {user} = await this.dbHubService.readUserByUserOId(where, file.userOId)

      if (!user) {
        return {file, user: V.NULL_User()}
      }

      // 4. 파일과 유저 반환 뙇!!
      return {file, user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // DELETE AREA:

  async deleteComment(jwtPayload: T.JwtPayloadType, commentOId: string) {
    const where = `/client/file/deleteComment`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_Comment(where, jwtPayload, commentOId)

      // 2. 댓글 삭제 뙇!!
      const {fileOId} = await this.dbHubService.deleteComment(where, commentOId)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByFileOId(where, fileOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteReply(jwtPayload: T.JwtPayloadType, replyOId: string) {
    const where = `/client/file/deleteReply`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_Reply(where, jwtPayload, replyOId)

      // 2. 대댓글 삭제 뙇!!
      const {fileOId} = await this.dbHubService.deleteReply(where, replyOId)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByFileOId(where, fileOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
