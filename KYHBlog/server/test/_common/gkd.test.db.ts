import {AUTH_VAL_ARR, AUTH_GUEST, gkdSaltOrRounds, AUTH_USER, AUTH_ADMIN} from '@secrets'

import * as bcrypt from 'bcrypt'
import * as mysql from 'mysql2/promise'
import * as T from '@common/types'

export class TestDB {
  private static db: mysql.Pool = null // GKDTestBase 에서 생성해서 넘겨준다

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
  public async initTestDB(db: mysql.Pool) {
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
  public getJwtPayload(userAuth: number) {
    const {signUpType, userId, userOId, userName} = this.getUserCommon(userAuth).user
    const jwtPayload: T.JwtPayloadType = {
      userOId,
      userName,
      signUpType,
      userId
    }
    return {jwtPayload}
  }

  public async resetBaseDB() {
    /**
     * 테스트용 데이터를 원래대로 돌려놓는다
     *
     * 1. 유저 롤백
     * 2. 디렉토리 롤백
     * 3. 파일 롤백
     */
    const connection = await TestDB.db.getConnection()

    try {
      /**
       * 1. 유저 롤백
       *   - 수정됬을수도 있는 DB 의 내용을 저장된 내용으로 돌려놓는다.
       */
      const queryUserAdmin = `UPDATE users SET picture = ?, signUpType = ?, userId = ?, userName = ?, userAuth = ?, userMail = ? WHERE userOId = ?`

      const userOId_root = '00000000000000000000000000000001'
      const userOId_user = '00000000000000000000000000000002'
      const userOId_banned = '00000000000000000000000000000003'

      const paramUserAdmin = ['', 'common', 'commonRoot', 'commonRoot', AUTH_ADMIN, 'root@root.root', userOId_root]
      const paramUserUser = ['', 'common', 'commonUser', 'commonUser', AUTH_USER, 'user@user.user', userOId_user]
      const paramUserBanned = ['', 'common', 'commonBan', 'commonBan', AUTH_GUEST, 'ban@ban.ban', userOId_banned]
      await connection.execute(queryUserAdmin, paramUserAdmin)
      await connection.execute(queryUserAdmin, paramUserUser)
      await connection.execute(queryUserAdmin, paramUserBanned)

      /**
       * 2. 디렉토리 롤백
       */
      const queryDir = `UPDATE directories SET dirName = ?, parentDirOId = ?, dirIdx = ?, fileArrLen = ?, subDirArrLen = ? WHERE dirOId = ?`

      const dirOId_root = '00000000000000000000000000000010'
      const dirOId_0 = '00000000000000000000000000000020'
      const dirOId_1 = '00000000000000000000000000000030'

      const paramDirRoot = ['root', 'NULL', 0, 1, 2, dirOId_root]
      const paramDir_0 = ['dir0', dirOId_root, 0, 1, 0, dirOId_0]
      const paramDir_1 = ['dir1', dirOId_root, 1, 1, 0, dirOId_1]

      await connection.execute(queryDir, paramDirRoot)
      await connection.execute(queryDir, paramDir_0)
      await connection.execute(queryDir, paramDir_1)

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

      await connection.execute(queryFile, paramFileRoot)
      await connection.execute(queryFile, paramFile_0)
      await connection.execute(queryFile, paramFile_1)
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

  private async _createUsersCommon() {
    const connection = await TestDB.db.getConnection()

    try {
      const query = `INSERT INTO users (userOId, hashedPassword, picture, signUpType, userId, userMail, userName, userAuth, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      const userOId_root = '000000000000000000000001'
      const userOId_user = '000000000000000000000002'
      const userOId_banned = '000000000000000000000003'

      const createdAt = new Date()

      const paramBanned = [
        userOId_banned,
        bcrypt.hashSync('authBannedPassword1!', gkdSaltOrRounds),
        '',
        'common',
        'commonBan',
        'ban@ban.ban',
        'commonBan',
        AUTH_GUEST,
        createdAt,
        createdAt
      ]
      const paramUser = [
        userOId_user,
        bcrypt.hashSync('authUserPassword1!', gkdSaltOrRounds),
        '',
        'common',
        'commonUser',
        'user@user.user',
        'commonUser',
        AUTH_USER,
        createdAt,
        createdAt
      ]
      const paramRoot = [
        userOId_root,
        bcrypt.hashSync('authRootPassword1!', gkdSaltOrRounds),
        '',
        'common',
        'commonRoot',
        'root@root.root',
        'commonRoot',
        AUTH_ADMIN,
        createdAt,
        createdAt
      ]
      await connection.execute(query, paramBanned)
      await connection.execute(query, paramUser)
      await connection.execute(query, paramRoot)

      TestDB.usersCommon[AUTH_GUEST] = {
        userOId: userOId_banned,
        userId: 'commonBan',
        userMail: 'ban@ban.ban',
        userName: 'commonBan',
        picture: '',
        userAuth: AUTH_GUEST,
        createdAt,
        updatedAt: createdAt
      }
      TestDB.usersCommon[AUTH_USER] = {
        userOId: userOId_user,
        userId: 'commonUser',
        userMail: 'user@user.user',
        userName: 'commonUser',
        picture: '',
        userAuth: AUTH_USER,
        createdAt,
        updatedAt: createdAt
      }
      TestDB.usersCommon[AUTH_ADMIN] = {
        userOId: userOId_root,
        userId: 'commonRoot',
        userMail: 'root@root.root',
        userName: 'commonRoot',
        picture: '',
        userAuth: AUTH_ADMIN,
        createdAt,
        updatedAt: createdAt
      }
      // ::
    } catch (errObj) {
      // ::
      console.log(`[DB 생성 오류]: 유저 생성`)
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
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
    const connection = await TestDB.db.getConnection()
    try {
      /**
       * 1. DB 에 테스트용 디렉토리 생성
       *   - 루트 디렉토리
       *     - 디렉토리 인덱스: 0
       *     - 디렉토리 인덱스: 1
       */
      const query = `INSERT INTO directories (dirOId, dirIdx, dirName, parentDirOId, fileArrLen, subDirArrLen) VALUES (?, ?, ?, ?, ?, ?)`

      const dirOId_root = '000000000000000000000010'
      const dirOId_0 = '000000000000000000000020'
      const dirOId_1 = '000000000000000000000030'

      const paramRoot = [dirOId_root, 0, 'root', null, 1, 2]
      const paramDir_0 = [dirOId_0, 0, 'dir0', dirOId_root, 1, 0]
      const paramDir_1 = [dirOId_1, 1, 'dir1', dirOId_root, 1, 0]

      await connection.execute(query, paramRoot)
      await connection.execute(query, paramDir_0)
      await connection.execute(query, paramDir_1)

      // 2. 루트 디렉토리 설정
      TestDB.rootDir = {
        dirName: 'root',
        dirOId: dirOId_root,
        fileOIdsArr: [],
        parentDirOId: null,
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
      console.log(`[DB 생성 오류]: 디렉토리 생성`)
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  private async _createFiles() {
    /**
     * 1. 루트 폴더에 테스트용 파일 1개 생성
     * 2. 루트_0번째 폴더에 테스트용 파일 1개 생성
     * 3. 루트_1번째 폴더에 테스트용 파일 1개 생성
     * 4. 파일 객체 설정
     * 5. 디렉토리 객체 설정
     */
    const connection = await TestDB.db.getConnection()
    try {
      /**
       * 1. 루트 폴더에 테스트용 파일 1개 생성
       * 2. 루트_0번째 폴더에 테스트용 파일 1개 생성
       * 3. 루트_1번째 폴더에 테스트용 파일 1개 생성
       */
      const query = `INSERT INTO files (fileOId, content, dirOId, fileIdx, fileName, fileStatus, userName, userOId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

      const dirOId_root = this.getRootDir().directory.dirOId
      const dirOId_0 = this.getDirectory(dirOId_root).directory.subDirOIdsArr[0]
      const dirOId_1 = this.getDirectory(dirOId_root).directory.subDirOIdsArr[1]

      const {userName, userOId} = this.getUserCommon(AUTH_ADMIN).user

      const fileOId_root = '000000000000000000000100'
      const fileOId_0 = '000000000000000000000200'
      const fileOId_1 = '000000000000000000000300'

      const createdAt = new Date()

      const paramRoot = [fileOId_root, 'content0', dirOId_root, 0, 'file', 0, userName, userOId, createdAt]
      const paramDir_0 = [fileOId_0, 'content1', dirOId_0, 0, 'file_0', 0, userName, userOId, createdAt]
      const paramDir_1 = [fileOId_1, 'content2', dirOId_1, 0, 'file_1', 0, userName, userOId, createdAt]

      await connection.execute(query, paramRoot)
      await connection.execute(query, paramDir_0)
      await connection.execute(query, paramDir_1)

      // 4. 파일 객체 설정
      TestDB.files[fileOId_root] = {
        content: 'content0',
        dirOId: dirOId_root,
        fileIdx: 0,
        fileOId: fileOId_root,
        fileStatus: 0,
        fileName: 'file',
        userName: userName,
        userOId: userOId,
        createdAt,
        updatedAt: createdAt
      }
      TestDB.files[fileOId_0] = {
        content: 'content1',
        dirOId: dirOId_0,
        fileIdx: 0,
        fileOId: fileOId_0,
        fileStatus: 0,
        fileName: 'file_0',
        userName: userName,
        userOId: userOId,
        createdAt,
        updatedAt: createdAt
      }
      TestDB.files[fileOId_1] = {
        content: 'content2',
        dirOId: dirOId_1,
        fileIdx: 0,
        fileOId: fileOId_1,
        fileStatus: 0,
        fileName: 'file_1',
        userName: userName,
        userOId: userOId,
        createdAt,
        updatedAt: createdAt
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
      console.log(`[DB 생성 오류]: 파일 생성`)
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  private async _deleteDBs() {
    /**
     * 1. 테스트용 파일 삭제
     * 2. 테스트용 디렉토리 삭제
     * 3. 테스트용 유저 삭제
     */
    const connection = await TestDB.db.getConnection()
    try {
      // 1. 테스트용 유저 삭제
      const query = `DELETE FROM users WHERE userOId IN (?, ?, ?)`
      // ::
      const userOId_root = '000000000000000000000001'
      const userOId_user = '000000000000000000000002'
      const userOId_banned = '000000000000000000000003'

      const param = [userOId_banned, userOId_user, userOId_root]
      await connection.execute(query, param)

      // ::
      // 2. 테스트용 디렉토리 삭제
      const queryDir = `DELETE FROM directories WHERE dirOId IN (?, ?, ?)`

      const dirOId_root = '000000000000000000000010'
      const dirOId_0 = '000000000000000000000020'
      const dirOId_1 = '000000000000000000000030'

      const paramDir = [dirOId_root, dirOId_0, dirOId_1]
      await connection.execute(queryDir, paramDir)

      // ::
      // 3. 테스트용 파일 삭제
      const queryFile = `DELETE FROM files WHERE fileOId IN (?, ?, ?)`

      const fileOId_root = '000000000000000000000100'
      const fileOId_0 = '000000000000000000000200'
      const fileOId_1 = '000000000000000000000300'

      const paramFile = [fileOId_root, fileOId_0, fileOId_1]
      await connection.execute(queryFile, paramFile)

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
  private async _checkRemainDB() {
    const connection = await TestDB.db.getConnection()
    try {
      const queryUser = `SELECT * FROM users`
      const queryDir = `SELECT * FROM directories`
      const queryFile = `SELECT * FROM files`

      const [userResult, dirResult, fileResult] = await Promise.all([
        connection.execute(queryUser),
        connection.execute(queryDir),
        connection.execute(queryFile)
      ])

      const userLen = (userResult[0] as any[]).length
      const dirLen = (dirResult[0] as any[]).length
      const fileLen = (fileResult[0] as any[]).length

      let errorMsg = ''

      if (userLen > 0) {
        errorMsg += `테스트용 유저가 남아있습니다. ${userLen}개\n`
      }
      if (dirLen > 0) {
        errorMsg += `테스트용 디렉토리가 남아있습니다. ${dirLen}개\n`
      }
      if (fileLen > 0) {
        errorMsg += `테스트용 파일이 남아있습니다. ${fileLen}개\n`
      }

      if (errorMsg.length > 0) {
        throw errorMsg
      }
      // ::
    } catch (errObj) {
      // ::
      console.log(errObj)
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
}
