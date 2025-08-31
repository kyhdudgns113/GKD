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

  async readCommentByCommentOId(where: string, commentOId: string) {
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

  async readCommentReplyArrByCommentOId(where: string, commentOId: string) {
    where = where + '/readCommentReplyArrByCommentOId'

    const connection = await this.dbService.getConnection()

    /**
     * commentOId 댓글이 속한 파일의 댓글 및 대댓글을 전부 읽어온다.
     */
    try {
      const query = `
        SELECT 
          c.commentOId AS commentOId,
          c.content AS commentContent,
          c.createdAt AS commentCreatedAt,
          c.userName AS commentUserName,
          c.userOId AS commentUserOId,
          c.fileOId AS commentFileOId,
          r.replyOId AS replyOId,
          r.commentOId AS replyCommentOId,
          r.content AS replyContent,
          r.createdAt AS replyCreatedAt,
          r.fileOId AS replyFileOId,
          r.userName AS replyUserName,
          r.userOId AS replyUserOId,
          r.targetUserName AS replyTargetUserName
        FROM comments c
        LEFT JOIN replies r ON c.commentOId = r.commentOId
        WHERE c.fileOId = (SELECT fileOId FROM comments WHERE commentOId = ?)
        ORDER BY c.createdAt ASC, r.createdAt ASC;
      `
      const params = [commentOId]
      const [result] = await connection.execute(query, params)
      const rowArr = result as RowDataPacket[]

      const entireCommentReplyLen = rowArr.length

      const commentReplyArr: (T.CommentType | T.ReplyType)[] = rowArr.map(row => {
        if (row.replyOId) {
          const {
            replyOId,
            replyCommentOId,
            replyContent,
            replyCreatedAt,
            replyFileOId,
            replyUserName,
            replyUserOId,
            replyTargetUserName,
            replyTargetUserOId
          } = row
          const reply: T.ReplyType = {
            replyOId,
            content: replyContent,
            createdAt: replyCreatedAt,
            fileOId: replyFileOId,
            userName: replyUserName,
            userOId: replyUserOId,
            targetUserOId: replyTargetUserOId,
            targetUserName: replyTargetUserName,
            commentOId: replyCommentOId
          }
          return reply
        } // ::
        else {
          const {commentOId, commentContent, commentCreatedAt, commentFileOId, commentUserName, commentUserOId} = row
          const comment: T.CommentType = {
            commentOId,
            content: commentContent,
            createdAt: commentCreatedAt,
            fileOId: commentFileOId,
            userName: commentUserName,
            userOId: commentUserOId
          }
          return comment
        }
      })

      return {commentReplyArr, entireCommentReplyLen}
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

  async readCommentReplyArrByFileOId(where: string, fileOId: string) {
    where = where + '/readCommentReplyArrByFileOId'

    const connection = await this.dbService.getConnection()

    /**
     * fileOId 파일의 댓글 및 대댓글을 전부 읽어온다.
     */
    try {
      const query = `
        SELECT 
          c.commentOId AS commentOId,
          c.content AS commentContent,
          c.createdAt AS commentCreatedAt,
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

      const entireCommentReplyLen = rowArr.length

      const commentReplyArr: (T.CommentType | T.ReplyType)[] = rowArr.map(row => {
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
          return reply
        } // ::
        else {
          const {commentOId, commentContent, commentCreatedAt, commentUserName, commentUserOId} = row
          const comment: T.CommentType = {
            commentOId,
            content: commentContent,
            createdAt: commentCreatedAt,
            fileOId,
            userName: commentUserName,
            userOId: commentUserOId
          }
          return comment
        }
      })

      return {commentReplyArr, entireCommentReplyLen}
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

  async updateComment(where: string, commentOId: string, newContent: string) {
    where = where + '/updateComment'

    const connection = await this.dbService.getConnection()

    try {
      const query = `UPDATE comments SET content = ? WHERE commentOId = ?`
      const params = [newContent, commentOId]
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

  async deleteComment(where: string, commentOId: string) {
    where = where + '/deleteComment'

    const connection = await this.dbService.getConnection()

    try {
      const queryRead = `SELECT fileOId FROM comments WHERE commentOId = ?`
      const paramsRead = [commentOId]
      const [resultRead] = await connection.execute(queryRead, paramsRead)
      const resultReadArr = resultRead as RowDataPacket[]
      const {fileOId} = resultReadArr[0]

      const queryDelete = `DELETE FROM comments WHERE commentOId = ?`
      const paramsDelete = [commentOId]
      await connection.execute(queryDelete, paramsDelete)

      return {fileOId}
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
