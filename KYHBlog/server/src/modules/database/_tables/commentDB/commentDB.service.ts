import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {generateObjectId} from '@utils'

import * as DTO from '@dtos'
import * as T from '@common/types'

@Injectable()
export class CommentDBService {
  constructor(private readonly dbService: DBService) {}

  async createComment(where: string, dto: DTO.CreateCommentDTO) {
    where = where + '/addComment'

    const {content, fileOId, userName, userOId} = dto

    const connection = await this.dbService.getConnection()

    /**
     * 1. commentOId 생성 (미중복 나올때까지 반복)
     * 2. 댓글 추가
     */

    try {
      let commentOId = generateObjectId()
      while (true) {
        const query = `SELECT commentOId FROM comments WHERE commentOId = ?`
        const [result] = await connection.execute(query, [commentOId])
        const resultArr = result as RowDataPacket[]
        if (resultArr.length === 0) break
        commentOId = generateObjectId()
      }

      const query = `INSERT INTO comments (commentOId, content, fileOId, userName, userOId) VALUES (?, ?, ?, ?, ?)`
      const params = [commentOId, content, fileOId, userName, userOId]
      await connection.execute(query, params)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  async readCommentArrByFileOId(where: string, fileOId: string, pageIdx: number) {
    where = where + '/readCommentArrByFileOId'

    const connection = await this.dbService.getConnection()

    /**
     * fileOId 파일의 댓글 및 대댓글을 총합 20개씩 조회한다.
     * - pageIdx 가 1이면 0번째부터 19번째까지 조회한다.
     */
    try {
      if (pageIdx < 1) {
        throw {
          gkd: {pageIdx: `pageIdx 가 1 이하입니다.`},
          gkdErrCode: 'COMMENTDB_readCommentArrByFileOId_InvalidPageIdx',
          gkdErrMsg: `pageIdx 가 1 이하입니다.`,
          gkdStatus: {pageIdx},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      const query = `
        SELECT 
          c.commentOId AS commentOId,
          c.content AS commentContent,
          c.createdAt AS commentCreatedAt,
          c.fileOId AS commentFileOId,
          c.userName AS commentUserName,
          c.userOId AS commentUserOId,
          r.replyOId AS replyOId,
          r.commentOId AS replyCommentOId,
          r.content AS replyContent,
          r.createdAt AS replyCreatedAt,
          r.userName AS replyUserName,
          r.userOId AS replyUserOId,
          r.targetUserName AS replyTargetUserName
        FROM comments c
        LEFT JOIN replies r ON c.commentOId = r.commentOId
        WHERE c.fileOId = ?
        ORDER BY c.createdAt ASC, r.createdAt ASC;
      `
      const params = [fileOId]
      const [result] = await connection.execute(query, params)
      const rowArr = result as RowDataPacket[]

      const entireCommentLen = rowArr.length

      const commentArr: T.CommentType[] = []
      let commentIdx = -1
      let rowIdx = -1
      const startIdx = (pageIdx - 1) * 20
      const endIdx = startIdx + 20

      rowArr.forEach(row => {
        rowIdx += 1

        if (rowIdx < startIdx) return
        if (rowIdx >= endIdx) return

        if (row.replyOId) {
          const {replyOId, replyCommentOId, replyContent, replyCreatedAt, replyUserName, replyUserOId, replyTargetUserName, replyTargetUserOId} = row
          const reply: T.ReplyType = {
            replyOId,
            content: replyContent,
            createdAt: replyCreatedAt,
            fileOId,
            userName: replyUserName,
            userOId: replyUserOId,
            targetUserOId: replyTargetUserOId,
            targetUserName: replyTargetUserName,
            commentOId: replyCommentOId
          }
          commentArr[commentIdx].replyArr.push(reply)
        } // ::
        else {
          const {commentOId, commentContent, commentFileOId, commentCreatedAt, commentUserName, commentUserOId} = row
          const comment: T.CommentType = {
            commentOId,
            content: commentContent,
            createdAt: commentCreatedAt,
            fileOId: commentFileOId,
            replyArr: [],
            userName: commentUserName,
            userOId: commentUserOId
          }
          commentArr.push(comment)
          commentIdx = commentIdx + 1
        }
      })

      return {commentArr, entireCommentLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  async readCommentByCommentOId(where: string, commentOId: string) {
    where = where + '/readCommentByCommentOId'

    const connection = await this.dbService.getConnection()

    try {
      const query = `
        SELECT 
          c.commentOId AS commentOId,
          c.content AS commentContent,
          c.createdAt AS commentCreatedAt,
          c.fileOId AS commentFileOId,
          c.userName AS commentUserName,
          c.userOId AS commentUserOId,
          r.replyOId AS replyOId,
          r.content AS replyContent,
          r.createdAt AS replyCreatedAt,
          r.userName AS replyUserName,
          r.userOId AS replyUserOId,
          r.targetUserName AS replyTargetUserName
        FROM comments c
        LEFT JOIN replies r ON c.commentOId = r.commentOId
        WHERE c.commentOId = ?
        ORDER BY c.createdAt ASC, r.createdAt ASC;
      `
      const params = [commentOId]
      const [result] = await connection.execute(query, params)
      const rowArr = result as RowDataPacket[]

      if (rowArr.length === 0) return null

      const first = rowArr[0]

      const comment: T.CommentType = {
        commentOId: first.commentOId,
        content: first.commentContent,
        createdAt: first.commentCreatedAt,
        fileOId: first.commentFileOId,
        userOId: first.commentUserOId,
        userName: first.commentUserName,
        replyArr: rowArr
          .filter(r => r.replyOId)
          .map(r => ({
            replyOId: r.replyOId,
            content: r.replyContent,
            createdAt: r.replyCreatedAt,
            fileOId: r.replyFileOId,
            userOId: r.replyUserOId,
            userName: r.replyUserName,
            targetUserOId: r.targetUserOId,
            targetUserName: r.targetUserName,
            commentOId: r.commentOId
          }))
      }

      return {comment}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  async readCommentByCommentOId_noReply(where: string, commentOId: string) {
    where = where + '/readCommentByCommentOId_noReply'

    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM comments WHERE commentOId = ?`
      const params = [commentOId]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {comment: null}
      }

      const {content, createdAt, fileOId, userName, userOId} = resultArr[0]

      const comment: T.CommentType = {
        commentOId,
        content,
        createdAt,
        fileOId,
        replyArr: [],
        userName,
        userOId
      }
      return {comment}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
}
