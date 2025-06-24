import {Injectable} from '@nestjs/common'

import * as T from '@common/types'
import * as S from '../_schemas'

import {AUTH_ADMIN, AUTH_USER} from '@secret'

/**
 * 이곳은 거의 대부분 Schema 의 함수랑 결과를 그대로 보내주는 역할만 한다.
 *
 * 이것들은 port 에서 해줘야 한다.
 * - 인자의 Error 체크
 * - 권한 체크 함수 실행
    P.FileDBModule
 *    - port 에서 db 접근할때마다 권한체크하면 오버헤드 심해진다.
 *
 * 이건 여기서 해준다.
 * - 권한 체크 함수 작성
 */
@Injectable()
export class DatabaseHubService {
  constructor(
    private readonly alarmDBService: S.AlarmDBService,
    private readonly directoryDBService: S.DirectoryDBService,
    private readonly fileDBService: S.FileDBService,
    private readonly logDBService: S.GKDLogDBService,
    private readonly userDBService: S.UserDBService
  ) {}

  // AREA1: AlarmDB CRUD
  async createAlarmReadingComment(where: string, fileUserOId: string, comment: T.CommentType) {
    try {
      const {alarm} = await this.alarmDBService.createAlarmReadingComment(where, fileUserOId, comment)
      return {alarm}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createAlarmReadingReply(where: string, targetObjectId: string, targetUserOId: string, reply: T.ReplyType) {
    try {
      const {alarm} = await this.alarmDBService.createAlarmReadingReply(where, targetObjectId, targetUserOId, reply)
      return {alarm}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readAlarm(where: string, alarmOId: string) {
    try {
      const {alarm} = await this.alarmDBService.readAlarm(where, alarmOId)
      return {alarm}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readAlarmArr(where: string, targetUserOId: string) {
    try {
      const {alarmArr} = await this.alarmDBService.readAlarmArr(where, targetUserOId)
      return {alarmArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readAlarmArrNotReceived(where: string, targetUserOId: string) {
    try {
      const {alarmArr} = await this.alarmDBService.readAlarmArrNotReceived(where, targetUserOId)
      return {alarmArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateAlarmArrReceived(where: string, receivedAlarmArr: T.AlarmType[]) {
    try {
      await this.alarmDBService.updateAlarmArrReceived(where, receivedAlarmArr)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteAlarm(where: string, alarmOId: string) {
    try {
      await this.alarmDBService.deleteAlarm(where, alarmOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA2: DirectoryDB CRUD
  async createDirectory(where: string, parentDirOId: string, dirName: string) {
    try {
      const {directory} = await this.directoryDBService.createDirectory(where, parentDirOId, dirName)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createDirectoryRoot(where: string) {
    try {
      const {rootDir} = await this.directoryDBService.createDirectoryRoot(where)
      return {rootDir}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readDirectoryByDirOId(where: string, dirOId: string) {
    try {
      const {directory} = await this.directoryDBService.readDirectoryByDirOId(where, dirOId)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirectoryByParentAndName(where: string, parentDirOId: string, dirName: string) {
    try {
      const {directory} = await this.directoryDBService.readDirectoryByParentAndName(where, parentDirOId, dirName)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirectoryRoot(where: string) {
    try {
      const {rootDir} = await this.directoryDBService.readDirectoryRoot(where)
      return {rootDir}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateDirectory(where: string, dirOId: string, directory: T.DirectoryType) {
    try {
      await this.directoryDBService.updateDirectory(where, dirOId, directory)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectoryAddFile(where: string, parentDirOId: string, newFileOId: string, targetIdx: number) {
    try {
      const {directory} = await this.directoryDBService.updateDirectoryAddFile(where, parentDirOId, newFileOId, targetIdx)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectoryAddSubDir(where: string, parentDirOId: string, newSubDirOId: string, targetIdx: number) {
    try {
      const {directory} = await this.directoryDBService.updateDirectoryAddSubDir(where, parentDirOId, newSubDirOId, targetIdx)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectoryFileSequence(where: string, parentDirOId: string, moveFileOId: string, targetIdx: number) {
    try {
      const {directory} = await this.directoryDBService.updateDirectoryFileSequence(where, parentDirOId, moveFileOId, targetIdx)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectoryName(where: string, dirOId: string, newDirName: string) {
    try {
      const {directory} = await this.directoryDBService.updateDirectoryName(where, dirOId, newDirName)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectoryParent(where: string, dirOId: string, newParentDirOId: string) {
    try {
      const {directory} = await this.directoryDBService.updateDirectoryParent(where, dirOId, newParentDirOId)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectoryPushBackDir(where: string, dirOId: string, newSubDirOId: string) {
    try {
      const {directory} = await this.directoryDBService.updateDirectoryPushBackDir(where, dirOId, newSubDirOId)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectoryPushBackFile(where: string, dirOId: string, fileOId: string) {
    try {
      const {directory} = await this.directoryDBService.updateDirectoryPushBackFile(where, dirOId, fileOId)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectoryRemoveSubDir(where: string, parentDirOId: string, dirOId: string) {
    try {
      const {directory} = await this.directoryDBService.updateDirectoryRemoveSubDir(where, parentDirOId, dirOId)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectoryRemoveSubFile(where: string, parentDirOId: string, fileOId: string) {
    try {
      const {directory} = await this.directoryDBService.updateDirectoryRemoveSubFile(where, parentDirOId, fileOId)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirectorySubDirsSequence(where: string, parentDirOId: string, moveDirOId: string, targetIdx: number) {
    try {
      const {directory} = await this.directoryDBService.updateDirectorySubDirsSequence(where, parentDirOId, moveDirOId, targetIdx)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteDirectory(where: string, dirOId: string) {
    try {
      await this.directoryDBService.deleteDirectory(where, dirOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  // AREA3: FileDB CRUD
  async createComment(where: string, fileOId: string, userOId: string, userName: string, content: string) {
    try {
      const {comment} = await this.fileDBService.createComment(where, fileOId, userOId, userName, content)
      return {comment}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createFile(where: string, parentDirOId: string, name: string) {
    try {
      const {file} = await this.fileDBService.createFile(where, parentDirOId, name)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
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
      const {comment, reply} = await this.fileDBService.createReply(where, commentOId, targetUserName, targetUserOId, userName, userOId, content)
      return {comment, reply}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readCommentByCommentOId(where: string, commentOId: string) {
    try {
      const {comment} = await this.fileDBService.readCommentByCommentOId(where, commentOId)
      return {comment}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readCommentsArrByFileOId(where: string, fileOId: string) {
    try {
      const {commentsArr} = await this.fileDBService.readCommentsArrByFileOId(where, fileOId)
      return {commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async readFileByFileOId(where: string, fileOId: string) {
    try {
      const {file} = await this.fileDBService.readFileByFileOId(where, fileOId)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readFileByParentAndName(where: string, parentDirOId: string, fileName: string) {
    try {
      const {file} = await this.fileDBService.readFileByParentAndName(where, parentDirOId, fileName)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readReply(where: string, commentOId: string, dateString: string, userOId: string) {
    try {
      const {reply} = await this.fileDBService.readReply(where, commentOId, dateString, userOId)
      return {reply}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async updateCommentContent(where: string, commentOId: string, content: string) {
    try {
      const {comment, commentsArr} = await this.fileDBService.updateCommentContent(where, commentOId, content)
      return {comment, commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateFile(where: string, fileOId: string, file: T.FileType) {
    try {
      await this.fileDBService.updateFile(where, fileOId, file)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateFileNameAndContents(where: string, fileOId: string, newName: string, newContentsArr: T.ContentType[]) {
    try {
      const {file} = await this.fileDBService.updateFileNameAndContents(where, fileOId, newName, newContentsArr)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateFileParent(where: string, fileOId: string, newParentDirOId: string) {
    try {
      const {file} = await this.fileDBService.updateFileParent(where, fileOId, newParentDirOId)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateReplyContent(where: string, commentOId: string, dateString: string, content: string) {
    try {
      const {reply, comment} = await this.fileDBService.updateReplyContent(where, commentOId, dateString, content)
      return {reply, comment}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteComment(where: string, commentOId: string) {
    try {
      const {commentsArr} = await this.fileDBService.deleteComment(where, commentOId)
      return {commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async deleteFile(where: string, fileOId: string) {
    try {
      await this.fileDBService.deleteFile(where, fileOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async deleteReply(where: string, commentOId: string, dateString: string, userOId: string) {
    try {
      await this.fileDBService.deleteReply(where, commentOId, dateString, userOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA4: LogDB CRUD
  async createLog(where: string, userOId: string, userId: string, gkdLog: string, gkdStatus: Object) {
    try {
      await this.logDBService.createLog(where, userOId, userId, gkdLog, gkdStatus)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createGKDErr(where: string, userOId: string, userId: string, gkdErr: string, gkdStatus: Object) {
    try {
      await this.logDBService.createGKDErr(where, userOId, userId, gkdErr, gkdStatus)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createGKDErrObj(where: string, userOId: string, userId: string, gkdErrObj: Object) {
    try {
      await this.logDBService.createGKDErrObj(where, userOId, userId, gkdErrObj)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA5: UserDB CRUD
  async createUser(where: string, userId: string, userName: string, hashedPassword: string) {
    try {
      const {user} = await this.userDBService.createUser(where, userId, userName, hashedPassword)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createUserGoogle(where: string, userId: string, userName: string, picture: string) {
    try {
      const {user} = await this.userDBService.createUserGoogle(where, userId, userName, picture)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readUserAuthByUserId(where: string, userId: string) {
    try {
      const {userAuth} = await this.userDBService.readUserAuthByUserId(where, userId)
      return {userAuth}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserId(where: string, userId: string) {
    try {
      const {user} = await this.userDBService.readUserByUserId(where, userId)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserIdAndPassword(where: string, userId: string, password: string) {
    try {
      const {user} = await this.userDBService.readUserByUserIdAndPassword(where, userId, password)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserName(where: string, userName: string) {
    try {
      const {user} = await this.userDBService.readUserByUserName(where, userName)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserOId(where: string, userOId: string) {
    try {
      const {user} = await this.userDBService.readUserByUserOId(where, userOId)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA1: CheckAuth
  async checkAuth(where: string, jwtPayload: T.JwtPayloadType, reqAuth: number) {
    try {
      const {userId} = jwtPayload
      const {userAuth} = await this.readUserAuthByUserId(where, userId)
      if (userAuth < reqAuth) {
        let auth = ''
        switch (reqAuth) {
          case AUTH_USER:
            auth = '유저 오류'
            break
          case AUTH_ADMIN:
            auth = '관리자 오류'
            break
          default:
            auth = `이상한 권한값 오류: ${reqAuth}`
            break
        }
        throw {gkd: {auth}, gkdStatus: {userId, userAuth}, where}
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuthComment(where: string, jwtPayload: T.JwtPayloadType, commentOId: string) {
    try {
      const {user} = await this.userDBService.readUserByUserOId(where, jwtPayload.userOId)
      const {comment} = await this.fileDBService.readCommentByCommentOId(where, commentOId)

      if (comment.userOId !== jwtPayload.userOId && user.userAuth !== AUTH_ADMIN) {
        throw {gkd: {commentOId: `권한이 없는 댓글입니다.`}, gkdStatus: {commentOId}, where}
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuthReply(where: string, jwtPayload: T.JwtPayloadType, commentOId: string, dateString: string) {
    try {
      const {user} = await this.userDBService.readUserByUserOId(where, jwtPayload.userOId)
      const {reply} = await this.fileDBService.readReply(where, commentOId, dateString, jwtPayload.userOId)

      if (reply.userOId !== jwtPayload.userOId && user.userAuth !== AUTH_ADMIN) {
        throw {gkd: {commentOId: `권한이 없는 대댓글입니다.`}, gkdStatus: {commentOId, dateString}, where}
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
