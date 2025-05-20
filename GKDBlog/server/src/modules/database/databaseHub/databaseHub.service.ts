import {Injectable} from '@nestjs/common'

import * as S from '../_schemas'

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
export class DatabaseHubService {
  constructor(
    private readonly directoryDBService: S.DirectoryDBService,
    private readonly fileDBService: S.FileDBService,
    private readonly logDBService: S.GKDLogDBService,
    private readonly userDBService: S.UserDBService
  ) {}

  // AREA1: FileDB CRUD
  async createFile(where: string, name: string) {
    try {
      const {file} = await this.fileDBService.createFile(where, name)
      return {file}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA2: LogDB CRUD
  async createLog(where: string, userOId: string, userId: string, gkdLog: string, gkdStatus: Object) {
    try {
      await this.logDBService.createLog(where, userOId, userId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async createGKDErr(where: string, userOId: string, userId: string, gkdErr: string, gkdStatus: Object) {
    try {
      await this.logDBService.createGKDErr(where, userOId, userId, gkdErr, gkdStatus)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async createGKDErrObj(where: string, userOId: string, userId: string, gkdErrObj: Object) {
    try {
      await this.logDBService.createGKDErrObj(where, userOId, userId, gkdErrObj)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA3: UserDB CRUD
  async createUser(where: string, userId: string, userName: string, hashedPassword: string) {
    try {
      const {user} = await this.userDBService.createUser(where, userId, userName, hashedPassword)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async createUserGoogle(where: string, userId: string, userName: string, picture: string) {
    try {
      const {user} = await this.userDBService.createUserGoogle(where, userId, userName, picture)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readUserAuthByUserId(where: string, userId: string) {
    try {
      const {userAuth} = await this.userDBService.readUserAuthByUserId(where, userId)
      return {userAuth}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUserByUserId(where: string, userId: string) {
    try {
      const {user} = await this.userDBService.readUserByUserId(where, userId)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUserByUserIdAndPassword(where: string, userId: string, password: string) {
    try {
      const {user} = await this.userDBService.readUserByUserIdAndPassword(where, userId, password)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUserByUserName(where: string, userName: string) {
    try {
      const {user} = await this.userDBService.readUserByUserName(where, userName)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUserByUserOId(where: string, userOId: string) {
    try {
      const {user} = await this.userDBService.readUserByUserOId(where, userOId)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
