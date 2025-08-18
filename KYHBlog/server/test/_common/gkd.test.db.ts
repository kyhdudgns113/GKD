import {AUTH_VAL_ARR, AUTH_GUEST, gkdSaltOrRounds, AUTH_USER, AUTH_ADMIN} from '@secrets'

import * as bcrypt from 'bcrypt'
import * as mysql from 'mysql2/promise'
import * as T from '@common/types'

export class TestDB {
  private static db: mysql.Connection // GKDTestBase 에서 생성해서 넘겨준다

  private static directories: {[dirOId: string]: T.DirectoryType} = {}
  private static files: {[fileOId: string]: T.FileType} = {}
  private static rootDir: T.DirectoryType = {
    dirName: 'root',
    dirOId: 'NULL',
    fileOIdsArr: [],
    parentDirOId: 'NULL',
    subDirOIdsArr: []
  }
  private static usersCommon: {[userAuth: number]: T.UserType} = {}

  constructor() {}

  public async cleanUpDB() {
    if (TestDB.db === null) return

    try {
      await this._deleteDBs()
      await this._checkRemainDB()

      console.log('DB 가 리셋되었습니다.')
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      TestDB.db = null
      // ::
    }
  }
  public async initTestDB(db: mysql.Connection) {
    try {
      if (TestDB.db !== null) return
      console.log(`DB 가 초기화 되고 있습니다...`)
      TestDB.db = db

      /**
       * 1. 테스트용 기본 유저(로컬) 생성
       * 2. 테스트용 기본 디렉토리 생성
       * 3. 테스트용 기본 파일 생성
       */
      await this._createUsersCommon()
      await this._createDirectories()
      await this._createFiles()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  public getUserCommon(userAuth: number) {
    return {user: TestDB.usersCommon[userAuth]}
  }
  public getRootDir() {
    return {directory: TestDB.rootDir}
  }
  public getDirectory(dirOId: string) {
    return {directory: TestDB.directories[dirOId]}
  }
  public getFile(fileOId: string) {
    return {file: TestDB.files[fileOId]}
  }

  public async resetBaseDB() {
    /**
     * 1. 유저 롤백
     * 2. 디렉토리 롤백
     * 3. 파일 롤백
     */
    try {
      /**
       * 1. 유저 롤백
       *   - 수정됬을수도 있는 DB 의 내용을 저장된 내용으로 돌려놓는다.
       */
      const queryUserAdmin = `UPDATE users SET picture = ?, signUpType = ?, userId = ?, userName = ?, userAuth = ? WHERE userOId = ?`

      const userOId_root = '00000000000000000000000000000001'
      const userOId_user = '00000000000000000000000000000002'
      const userOId_banned = '00000000000000000000000000000003'

      const paramUserAdmin = ['', 'common', 'commonRoot', 'commonRoot', AUTH_ADMIN, userOId_root]
      const paramUserUser = ['', 'common', 'commonUser', 'commonUser', AUTH_USER, userOId_user]
      const paramUserBanned = ['', 'common', 'commonBan', 'commonBan', AUTH_GUEST, userOId_banned]
      await TestDB.db.execute(queryUserAdmin, paramUserAdmin)
      await TestDB.db.execute(queryUserAdmin, paramUserUser)
      await TestDB.db.execute(queryUserAdmin, paramUserBanned)

      /**
       * 2. 디렉토리 롤백
       */
      const queryDir = `UPDATE directories SET dirName = ?, parentDirOId = ?, dirIdx = ? WHERE dirOId = ?`

      const dirOId_root = '00000000000000000000000000000010'
      const dirOId_0 = '00000000000000000000000000000020'
      const dirOId_1 = '00000000000000000000000000000030'

      const paramDirRoot = ['root', 'NULL', 0, dirOId_root]
      const paramDir_0 = ['dir0', dirOId_root, 0, dirOId_0]
      const paramDir_1 = ['dir1', dirOId_root, 1, dirOId_1]

      await TestDB.db.execute(queryDir, paramDirRoot)
      await TestDB.db.execute(queryDir, paramDir_0)
      await TestDB.db.execute(queryDir, paramDir_1)

      /**
       * 3. 파일 롤백
       */
      const queryFile = `UPDATE files SET content = ?, dirOId = ?, fileIdx = ?, fileName = ?, fileStatus = ?, userName = ?, userOId = ? WHERE fileOId = ?`

      const fileOId_root = '00000000000000000000000000000100'
      const fileOId_0 = '00000000000000000000000000000200'
      const fileOId_1 = '00000000000000000000000000000300'

      const paramFileRoot = ['content0', dirOId_root, 0, 'file', 0, 'commonRoot', userOId_root, fileOId_root]
      const paramFile_0 = ['content1', dirOId_0, 0, 'file_0', 0, 'commonRoot', userOId_user, fileOId_0]
      const paramFile_1 = ['content2', dirOId_1, 0, 'file_1', 0, 'commonRoot', userOId_user, fileOId_1]

      await TestDB.db.execute(queryFile, paramFileRoot)
      await TestDB.db.execute(queryFile, paramFile_0)
      await TestDB.db.execute(queryFile, paramFile_1)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _createUsersCommon() {
    try {
      const query = `INSERT INTO users (userOId, hashedPassword, picture, signUpType, userId, userName, userAuth) VALUES (?, ?, ?, ?, ?, ?, ?)`

      const userOId_root = '00000000000000000000000000000001'
      const userOId_user = '00000000000000000000000000000002'
      const userOId_banned = '00000000000000000000000000000003'

      const paramBanned = [userOId_banned, bcrypt.hashSync('authBannedPassword', gkdSaltOrRounds), '', 'common', 'commonBan', 'commonBan', AUTH_GUEST]
      const paramUser = [userOId_user, bcrypt.hashSync('authUserPassword', gkdSaltOrRounds), '', 'common', 'commonUser', 'commonUser', AUTH_USER]
      const paramRoot = [userOId_root, bcrypt.hashSync('authRootPassword', gkdSaltOrRounds), '', 'common', 'commonRoot', 'commonRoot', AUTH_USER]
      await TestDB.db.execute(query, paramBanned)
      await TestDB.db.execute(query, paramUser)
      await TestDB.db.execute(query, paramRoot)

      TestDB.usersCommon[AUTH_GUEST] = {
        userOId: userOId_banned,
        userId: 'commonBan',
        userName: 'commonBan',
        picture: '',
        userAuth: AUTH_GUEST
      }
      TestDB.usersCommon[AUTH_USER] = {
        userOId: userOId_user,
        userId: 'commonUser',
        userName: 'commonUser',
        picture: '',
        userAuth: AUTH_USER
      }
      TestDB.usersCommon[AUTH_ADMIN] = {
        userOId: userOId_root,
        userId: 'commonRoot',
        userName: 'commonRoot',
        picture: '',
        userAuth: AUTH_ADMIN
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _createDirectories() {
    /**
     * 1. DB 에 테스트용 디렉토리 생성
     *   - 루트 디렉토리
     *     - 디렉토리 인덱스: 0
     *     - 디렉토리 인덱스: 1
     * 2. 루트 디렉토리 설정
     * 3. 디렉토리 객체 설정
     */
    try {
      /**
       * 1. DB 에 테스트용 디렉토리 생성
       *   - 루트 디렉토리
       *     - 디렉토리 인덱스: 0
       *     - 디렉토리 인덱스: 1
       */
      const query = `INSERT INTO directories (dirOId, dirIdx, dirName, parentDirOId) VALUES (?, ?, ?, ?)`

      const dirOId_root = '00000000000000000000000000000010'
      const dirOId_0 = '00000000000000000000000000000020'
      const dirOId_1 = '00000000000000000000000000000030'

      const paramRoot = [dirOId_root, 0, 'root', 'NULL']
      const paramDir_0 = [dirOId_0, 0, 'dir0', dirOId_root]
      const paramDir_1 = [dirOId_1, 1, 'dir1', dirOId_root]

      await TestDB.db.execute(query, paramRoot)
      await TestDB.db.execute(query, paramDir_0)
      await TestDB.db.execute(query, paramDir_1)

      // 2. 루트 디렉토리 설정
      TestDB.rootDir = {
        dirName: 'root',
        dirOId: dirOId_root,
        fileOIdsArr: [],
        parentDirOId: 'NULL',
        subDirOIdsArr: [dirOId_0, dirOId_1]
      }

      // 3. 디렉토리 객체 설정
      TestDB.directories[dirOId_root] = TestDB.rootDir
      TestDB.directories[dirOId_0] = {
        dirName: 'dir0',
        dirOId: dirOId_0,
        fileOIdsArr: [],
        parentDirOId: dirOId_root,
        subDirOIdsArr: []
      }
      TestDB.directories[dirOId_1] = {
        dirName: 'dir1',
        dirOId: dirOId_1,
        fileOIdsArr: [],
        parentDirOId: dirOId_root,
        subDirOIdsArr: []
      }

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _createFiles() {
    /**
     * 1. 루트 폴더에 테스트용 파일 1개 생성
     * 2. 루트_0번째 폴더에 테스트용 파일 1개 생성
     * 3. 루트_1번째 폴더에 테스트용 파일 1개 생성
     * 4. 파일 객체 설정
     */
    try {
      /**
       * 1. 루트 폴더에 테스트용 파일 1개 생성
       * 2. 루트_0번째 폴더에 테스트용 파일 1개 생성
       * 3. 루트_1번째 폴더에 테스트용 파일 1개 생성
       */
      const query = `INSERT INTO files (fileOId, content, dirOId, fileIdx, fileName, fileStatus, userName, userOId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

      const dirOId_root = this.getRootDir().directory.dirOId
      const dirOId_0 = this.getDirectory(dirOId_root).directory.subDirOIdsArr[0]
      const dirOId_1 = this.getDirectory(dirOId_root).directory.subDirOIdsArr[1]

      const {userName, userOId} = this.getUserCommon(AUTH_ADMIN).user

      const fileOId_root = '00000000000000000000000000000100'
      const fileOId_0 = '00000000000000000000000000000200'
      const fileOId_1 = '00000000000000000000000000000300'

      const paramRoot = [fileOId_root, 'content0', dirOId_root, 0, 'file', 0, userName, userOId]
      const paramDir_0 = [fileOId_0, 'content1', dirOId_0, 0, 'file_0', 0, userName, userOId]
      const paramDir_1 = [fileOId_1, 'content2', dirOId_1, 0, 'file_1', 0, userName, userOId]

      await TestDB.db.execute(query, paramRoot)
      await TestDB.db.execute(query, paramDir_0)
      await TestDB.db.execute(query, paramDir_1)

      // 4. 파일 객체 설정
      TestDB.files[fileOId_root] = {
        content: 'content0',
        dirOId: dirOId_root,
        fileIdx: 0,
        fileOId: fileOId_root,
        fileStatus: 0,
        fileName: 'file',
        userName: userName,
        userOId: userOId
      }
      TestDB.files[fileOId_0] = {
        content: 'content1',
        dirOId: dirOId_0,
        fileIdx: 0,
        fileOId: fileOId_0,
        fileStatus: 0,
        fileName: 'file_0',
        userName: userName,
        userOId: userOId
      }
      TestDB.files[fileOId_1] = {
        content: 'content2',
        dirOId: dirOId_1,
        fileIdx: 0,
        fileOId: fileOId_1,
        fileStatus: 0,
        fileName: 'file_1',
        userName: userName,
        userOId: userOId
      }

      /**
       * 5. 디렉토리 객체 설정
       */
      TestDB.directories[dirOId_root].fileOIdsArr.push(fileOId_root)
      TestDB.directories[dirOId_0].fileOIdsArr.push(fileOId_0)
      TestDB.directories[dirOId_1].fileOIdsArr.push(fileOId_1)

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _deleteDBs() {
    /**
     * 1. 테스트용 유저 삭제
     * 2. 테스트용 디렉토리 삭제
     * 3. 테스트용 파일 삭제
     */
    try {
      // 1. 테스트용 유저 삭제
      const query = `DELETE FROM users WHERE userOId IN (?, ?, ?)`
      // ::
      const userOId_root = '00000000000000000000000000000001'
      const userOId_user = '00000000000000000000000000000002'
      const userOId_banned = '00000000000000000000000000000003'

      const param = [userOId_banned, userOId_user, userOId_root]
      await TestDB.db.execute(query, param)

      // ::
      // 2. 테스트용 디렉토리 삭제
      const queryDir = `DELETE FROM directories WHERE dirOId IN (?, ?, ?)`

      const dirOId_root = '00000000000000000000000000000010'
      const dirOId_0 = '00000000000000000000000000000020'
      const dirOId_1 = '00000000000000000000000000000030'

      const paramDir = [dirOId_root, dirOId_0, dirOId_1]
      await TestDB.db.execute(queryDir, paramDir)

      // ::
      // 3. 테스트용 파일 삭제
      const queryFile = `DELETE FROM files WHERE fileOId IN (?, ?, ?)`

      const fileOId_root = '00000000000000000000000000000100'
      const fileOId_0 = '00000000000000000000000000000200'
      const fileOId_1 = '00000000000000000000000000000300'

      const paramFile = [fileOId_root, fileOId_0, fileOId_1]
      await TestDB.db.execute(queryFile, paramFile)

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _checkRemainDB() {
    try {
      const queryUser = `SELECT * FROM users`
      const queryDir = `SELECT * FROM directories`
      const queryFile = `SELECT * FROM files`

      const [userResult, dirResult, fileResult] = await Promise.all([
        TestDB.db.execute(queryUser),
        TestDB.db.execute(queryDir),
        TestDB.db.execute(queryFile)
      ])

      let errorMsg = ''

      if (userResult.length > 0) {
        errorMsg += `테스트용 유저가 남아있습니다. ${userResult.length}개\n`
      }
      if (dirResult.length > 0) {
        errorMsg += `테스트용 디렉토리가 남아있습니다. ${dirResult.length}개\n`
      }
      if (fileResult.length > 0) {
        errorMsg += `테스트용 파일이 남아있습니다. ${fileResult.length}개\n`
      }

      if (errorMsg.length > 0) {
        throw errorMsg
      }
      // ::
    } catch (errObj) {
      // ::
      console.log(errObj)
      throw errObj
    }
  }
}
