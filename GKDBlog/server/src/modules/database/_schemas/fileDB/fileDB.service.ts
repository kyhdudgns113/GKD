import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {CommentDB, FileDB, ReplyTypeClass} from './fileDB.entity'

import * as T from '@common/types'

@Injectable()
export class FileDBService {
  constructor(
    @InjectModel(CommentDB.name) private commentModel: Model<CommentDB>,
    @InjectModel(FileDB.name) private fileModel: Model<FileDB>
  ) {}

  async createComment(where: string, fileOId: string, userOId: string, userName: string, content: string) {
    try {
      const newDate = new Date()
      const newDateString = newDate.toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})
      const dateString = newDateString

      const newComment = new this.commentModel({fileOId, userOId, userName, content, dateString})
      const commentDB = await newComment.save()

      const {_id, date} = commentDB

      const comment: T.CommentType = {
        commentOId: _id.toString(),
        content,
        date,
        dateString,
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
    }
  }
  async createFile(where: string, parentDirOId: string, name: string) {
    where = where + '/createFile'
    try {
      const newFile = new this.fileModel({name, parentDirOId})
      const fileDB = await newFile.save()

      const {_id, contentsArr, isIntroPost} = fileDB
      const fileOId = _id.toString()
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId, isIntroPost}
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async createReply(
    where: string,
    commentOId: string,
    targetUserName: string,
    targetUserOId: string,
    userName: string,
    userOId: string,
    content: string
  ) {
    try {
      const _id = new Types.ObjectId(commentOId)
      const prevCommentDB = await this.commentModel.findOne({_id})

      const {replyArr} = prevCommentDB

      const date = new Date()
      const dateString = date.toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})

      const reply: T.ReplyType = {commentOId, content, date, dateString, targetUserName, targetUserOId, userName, userOId}

      const newReplyArr = [...replyArr, reply]
      const commentDB = await this.commentModel.findByIdAndUpdate(_id, {$set: {replyArr: newReplyArr}}, {new: true})

      if (commentDB) {
        const {content, date, dateString, fileOId, replyArr, userName, userOId} = commentDB
        const comment: T.CommentType = {commentOId, content, date, dateString, fileOId, replyArr, userName, userOId}
        return {reply, comment}
      }

      throw {gkd: {commentOId: `댓글 조회 안됨`}, gkdErr: `댓글 조회 안됨`, gkdStatus: {commentOId}, where}

      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async readCommentByCommentOId(where: string, commentOId: string) {
    where = where + '/readCommentByCommentOId'
    try {
      const _id = new Types.ObjectId(commentOId)
      const commentDB = await this.commentModel.findById(_id)

      const {content, date, dateString, fileOId, replyArr, userName, userOId} = commentDB
      const comment: T.CommentType = {
        commentOId,
        content,
        date,
        dateString,
        fileOId,
        replyArr,
        userName,
        userOId
      }
      return {comment}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async readCommentsArrByFileOId(where: string, fileOId: string) {
    /**
     * 1. fileOId 에 해당하는 댓글들을 모두 불러온다.
     * 2. date 를 기준으로 먼저 생성된 댓글을 낮은 인덱스로 정렬한다.
     */
    where = where + '/readCommentsArr'
    try {
      const arrDB = await this.commentModel.find({fileOId})
      const commentsArr: T.CommentType[] = arrDB.map(commentDB => {
        const {_id, date, dateString, content, replyArr, userOId, userName} = commentDB
        const commentOId = _id.toString()
        const comment: T.CommentType = {commentOId, content, date, dateString, fileOId, replyArr, userOId, userName}
        return comment
      })
      commentsArr.sort((a, b) => a.date.getTime() - b.date.getTime())
      return {commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async readFileByFileOId(where: string, fileOId: string) {
    where = where + '/readFileByFileOId'
    try {
      const _id = new Types.ObjectId(fileOId)
      const fileDB = await this.fileModel.findOne({_id})

      // 파일 없으면 null 리턴한다.
      if (!fileDB) {
        return {file: null}
      }
      const {contentsArr, isIntroPost, name, parentDirOId} = fileDB
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId, isIntroPost}
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async readFileByParentAndName(where: string, parentDirOId: string, fileName: string) {
    where = where + '/readFileByParentAndName'
    try {
      const fileDB = await this.fileModel.findOne({parentDirOId, name: fileName})

      // 파일 없으면 null 리턴한다.
      if (!fileDB) {
        return {file: null}
      }

      const {_id, name, contentsArr, isIntroPost} = fileDB
      const fileOId = _id.toString()
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId, isIntroPost}
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async readFileIntroPost(where: string) {
    try {
      const fileDB = await this.fileModel.findOne({isIntroPost: true})

      if (!fileDB) {
        return {file: null}
      } // ::
      else {
        return {file: fileDB}
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async readReply(where: string, commentOId: string, dateString: string, userOId: string) {
    where = where + '/readReply'
    try {
      const _id = new Types.ObjectId(commentOId)
      const commentDB = await this.commentModel.findById(_id)
      const {replyArr} = commentDB

      const reply = replyArr.find(reply => reply.dateString === dateString && reply.userOId === userOId)

      if (!reply) {
        return {reply: null}
      }

      return {reply}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async updateCommentContent(where: string, commentOId: string, content: string) {
    where = where + '/updateCommentContent'
    try {
      const _id = new Types.ObjectId(commentOId)
      await this.commentModel.findByIdAndUpdate(_id, {$set: {content}})

      const commentDB = await this.commentModel.findById(_id)
      const {date, dateString, fileOId, replyArr, userName, userOId} = commentDB
      const comment: T.CommentType = {commentOId, content, date, dateString, fileOId, replyArr, userName, userOId}

      const commentsArrDB = await this.commentModel.find({fileOId})
      const commentsArr: T.CommentType[] = commentsArrDB.map(commentDB => {
        const {_id, date, dateString, content, userOId, userName} = commentDB
        const commentOId = _id.toString()
        const comment: T.CommentType = {commentOId, content, date, dateString, fileOId, replyArr: [], userOId, userName}
        return comment
      })
      commentsArr.sort((a, b) => a.date.getTime() - b.date.getTime())

      return {comment, commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async updateFile(where: string, fileOId: string, file: T.FileType) {
    where = where + '/updateFile'
    try {
      const _id = new Types.ObjectId(fileOId)
      const {name, contentsArr, isIntroPost, parentDirOId} = file
      await this.fileModel.updateOne({_id}, {$set: {name, contentsArr, parentDirOId, isIntroPost}})
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async updateFileNameAndContents(where: string, fileOId: string, newName: string, newContentsArr: T.ContentType[]) {
    where = where + '/updateFileNameAndContents'
    try {
      const _id = new Types.ObjectId(fileOId)
      const fileDB = await this.fileModel.findByIdAndUpdate(_id, {$set: {name: newName, contentsArr: newContentsArr}})

      const {name, contentsArr, isIntroPost, parentDirOId} = fileDB
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId, isIntroPost}
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async updateFileParent(where: string, fileOId: string, newParentDirOId: string) {
    where = where + '/updateFileParent'
    try {
      const _id = new Types.ObjectId(fileOId)
      await this.fileModel.findByIdAndUpdate(_id, {$set: {parentDirOId: newParentDirOId}})

      const newFileDB = await this.fileModel.findById(_id)
      const {name, contentsArr, isIntroPost, parentDirOId} = newFileDB
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId, isIntroPost}
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async updateReplyContent(where: string, commentOId: string, _dateString: string, content: string) {
    where = where + '/updateReplyContent'
    try {
      const _id = new Types.ObjectId(commentOId)

      const prevCommentDB = await this.commentModel.findById(_id)
      const prevReplyArr = prevCommentDB.replyArr
      let reply: T.ReplyType

      const newReplyArr = prevReplyArr.map(_reply => {
        if (_reply.dateString === _dateString) {
          _reply.content = content
        }
        reply = _reply
        return _reply
      })

      const commentDB = await this.commentModel.findByIdAndUpdate(_id, {$set: {replyArr: newReplyArr}})

      const {date, dateString, fileOId, replyArr, userName, userOId} = commentDB
      const comment: T.CommentType = {commentOId, content, date, dateString, fileOId, replyArr, userName, userOId}

      return {comment, reply}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
    // ::
  }
  async updateFileToggleIsIntroPost(where: string, fileOId: string) {
    where = where + '/updateFileToggleIsIntroPost'
    try {
      const _id = new Types.ObjectId(fileOId)
      const fileDB = await this.fileModel.findById(_id)
      const {name, contentsArr, isIntroPost, parentDirOId} = fileDB

      let prevIntroFileArr: T.FileType[] = []

      // fileOId 가 새로운 공지글이 된거면 기존 공지글이었던 파일들은 전부 false 로 바꾼다.
      // 그리고 어떤 파일이 바뀌었는지 정보를 전달하기 위해 리턴한다.
      if (!isIntroPost) {
        const prevIntroFileArrDB = await this.fileModel.find({isIntroPost: true})
        prevIntroFileArr = prevIntroFileArrDB.map(fileDB => {
          const {_id, name, contentsArr, parentDirOId} = fileDB
          const fileOId = _id.toString()
          const file: T.FileType = {fileOId, name, contentsArr, parentDirOId, isIntroPost: false}
          return file
        })
        await this.fileModel.updateMany({}, {$set: {isIntroPost: false}})
      }

      await this.fileModel.updateOne({_id}, {$set: {isIntroPost: !isIntroPost}})
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId, isIntroPost: !isIntroPost}
      return {file, prevIntroFileArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async deleteComment(where: string, commentOId: string) {
    where = where + '/deleteComment'
    try {
      const _id = new Types.ObjectId(commentOId)
      const commentDB = await this.commentModel.findByIdAndDelete(_id)
      const {fileOId} = commentDB

      const commentsArrDB = await this.commentModel.find({fileOId})
      const commentsArr: T.CommentType[] = commentsArrDB.map(commentDB => {
        const {_id, date, dateString, content, userOId, userName} = commentDB
        const commentOId = _id.toString()
        const comment: T.CommentType = {commentOId, content, date, dateString, fileOId, replyArr: [], userOId, userName}
        return comment
      })
      return {commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
    // ::
  }
  async deleteFile(where: string, fileOId: string) {
    where = where + '/deleteFile'
    try {
      const _id = new Types.ObjectId(fileOId)
      await this.fileModel.findByIdAndDelete(_id)
      await this.commentModel.deleteMany({fileOId})
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async deleteReply(where: string, commentOId: string, dateString: string, userOId: string) {
    where = where + '/deleteReply'
    try {
      const _id = new Types.ObjectId(commentOId)
      const commentDB = await this.commentModel.findById(_id)
      const {replyArr} = commentDB

      const newReplyArr = replyArr.filter(reply => reply.dateString !== dateString || reply.userOId !== userOId)
      await this.commentModel.findByIdAndUpdate(_id, {$set: {replyArr: newReplyArr}})
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
}
