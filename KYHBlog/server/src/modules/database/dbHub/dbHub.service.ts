import {Injectable} from '@nestjs/common'
import {AUTH_ADMIN, AUTH_USER} from '@common/secret'

import * as DB from '../_tables'
import * as DTO from '@dtos'
import * as T from '@common/types'

/**
 * 이곳은 거의 대부분 Schema 의 함수랑 결과를 그대로 보내주는 역할만 한다.
 *
 * 이것들은 port 에서 해줘야 한다.
 * - 인자의 Error 체크
 * - 권한 체크 함수 실행
 *    - port 에서 db 접근할때마다 권한체크하면 오버헤드 심해진다.
 *
 * 이건 여기서 해준다.
 * - 권한 체크 함수 작성
 */
@Injectable()
export class DBHubService {
  constructor(
    private readonly commentDBService: DB.CommentDBService,
    private readonly dirDBService: DB.DirectoryDBService,
    private readonly fileDBService: DB.FileDBService,
    private readonly userDBService: DB.UserDBService
  ) {}

  // AREA2: CommentDB Area
  async createComment(where: string, dto: DTO.CreateCommentDTO) {
    try {
      await this.commentDBService.createComment(where, dto)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readCommentReplyArrByCommentOId(where: string, commentOId: string) {
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.commentDBService.readCommentReplyArrByCommentOId(where, commentOId)
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readCommentReplyArrByFileOId(where: string, fileOId: string) {
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.commentDBService.readCommentReplyArrByFileOId(where, fileOId)
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateComment(where: string, commentOId: string, newContent: string) {
    try {
      await this.commentDBService.updateComment(where, commentOId, newContent)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteComment(where: string, commentOId: string) {
    try {
      const {fileOId} = await this.commentDBService.deleteComment(where, commentOId)
      return {fileOId}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA3: DirectoryDB Area
  async createDir(where: string, dto: DTO.CreateDirDTO) {
    try {
      const {directory} = await this.dirDBService.createDir(where, dto)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createDirRoot(where: string) {
    try {
      const {directory} = await this.dirDBService.createDirRoot(where)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readDirArrByParentDirOId(where: string, parentDirOId: string) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.readDirArrByParentDirOId(where, parentDirOId)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirByDirOId(where: string, dirOId: string) {
    try {
      const {directory, fileRowArr} = await this.dirDBService.readDirByDirOId(where, dirOId)
      return {directory, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirRoot(where: string) {
    try {
      const {directory, fileRowArr} = await this.dirDBService.readDirRoot(where)
      return {directory, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateDirArr_Dir(where: string, dirOId: string, subDirOIdsArr: string[]) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.updateDirArr_Dir(where, dirOId, subDirOIdsArr)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirArr_File(where: string, dirOId: string, subFileOIdsArr: string[]) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.updateDirArr_File(where, dirOId, subFileOIdsArr)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirName(where: string, dirOId: string, dirName: string) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.updateDirName(where, dirOId, dirName)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteDir(where: string, dirOId: string) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.deleteDir(where, dirOId)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async isAncestor(where: string, baseDirOId: string, targetDirOId: string) {
    try {
      return await this.dirDBService.isAncestor(where, baseDirOId, targetDirOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA4: FileDB Area
  async createFile(where: string, dto: DTO.CreateFileDTO) {
    try {
      const {file} = await this.fileDBService.createFile(where, dto)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
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
  async readFileRowArrByDirOId(where: string, dirOId: string) {
    try {
      const {fileRowArr} = await this.fileDBService.readFileRowArrByDirOId(where, dirOId)
      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateFileName(where: string, fileOId: string, fileName: string) {
    try {
      const {directoryArr, fileRowArr} = await this.fileDBService.updateFileName(where, fileOId, fileName)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateFileNameContent(where: string, fileOId: string, fileName: string, content: string) {
    try {
      const {directoryArr, fileRowArr} = await this.fileDBService.updateFileNameContent(where, fileOId, fileName, content)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteFile(where: string, fileOId: string) {
    try {
      const {directoryArr, fileRowArr} = await this.fileDBService.deleteFile(where, fileOId)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA5: UserDB Area
  async createUser(where: string, dto: DTO.SignUpDTO) {
    try {
      const {user} = await this.userDBService.createUser(where, dto)
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

  // AREA6: CheckAuth

  async checkAuthAdmin(where: string, jwtPayload: T.JwtPayloadType) {
    try {
      const {userOId} = jwtPayload
      const {user} = await this.readUserByUserOId(where, userOId)

      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuthAdmin_noUser',
          gkdErrMsg: `유저가 없음`,
          gkdStatus: {userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      if (user.userAuth !== AUTH_ADMIN) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuthAdmin_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuthUser(where: string, jwtPayload: T.JwtPayloadType) {
    try {
      const {userOId} = jwtPayload
      const {user} = await this.readUserByUserOId(where, userOId)

      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuthAdmin_noUser',
          gkdErrMsg: `유저가 없음`,
          gkdStatus: {userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      if (user.userAuth < AUTH_USER) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuthAdmin_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuth_Comment(where: string, jwtPayload: T.JwtPayloadType, commentOId: string) {
    try {
      const {comment} = await this.commentDBService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw {
          gkd: {noComment: `댓글이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Comment_noComment',
          gkdErrMsg: `댓글이 없습니다.`,
          gkdStatus: {commentOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const {user} = await this.readUserByUserOId(where, jwtPayload.userOId)
      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Comment_noUser',
          gkdErrMsg: `유저가 없습니다.`,
          gkdStatus: {userOId: comment.userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const isAlreadyBanned = user.userAuth < AUTH_USER
      const isDifferentUser = user.userOId !== comment.userOId
      const isAdmin = user.userAuth === AUTH_ADMIN

      if (isAlreadyBanned || (isDifferentUser && !isAdmin)) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Comment_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId: jwtPayload.userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
