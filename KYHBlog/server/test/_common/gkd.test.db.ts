import {AUTH_VAL_ARR, AUTH_GUEST, gkdSaltOrRounds, AUTH_USER, AUTH_ADMIN} from '@secret'

import * as bcrypt from 'bcrypt'
import * as mysql from 'mysql2/promise'
import * as T from '@type'
import * as TV from '@testValue'

export class TestDB {
  // AREA1: Static Variable Area
  private static db: mysql.Pool = null // GKDTestBase 에서 생성해서 넘겨준다

  private static directories: {[dirOId: string]: T.DirectoryType} = {}
  private static files: {[fileOId: string]: T.FileType} = {}
  private static rootDir: T.DirectoryType = {
    dirName: 'WILL_BE_INIT_IN_CREATE',
    dirOId: null,
    fileOIdsArr: [],
    parentDirOId: null,
    subDirOIdsArr: []
  }
  private static usersCommon: {[userAuth: number]: T.UserType[]} = {}

  // AREA2: Constant Variable Area

  constructor() {}

  // AREA3: Method Area

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

  public getUserCommon(userAuth: number, userIdx: number = 0) {
    if (userAuth !== AUTH_USER || userIdx === 0) {
      return {user: TestDB.usersCommon[userAuth][0]}
    } // ::
    else {
      return {user: TestDB.usersCommon[userAuth][userIdx]}
    }
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
  public getJwtPayload(userAuth: number, userIdx: number = 0) {
    const {signUpType, userId, userOId, userName} = this.getUserCommon(userAuth, userIdx).user
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
    const {dirOId_root, dirOId_0, dirOId_1} = TV
    const {dirInfo_root, dirInfo_0, dirInfo_1} = TV
    const {fileOId_root, fileOId_0, fileOId_1} = TV
    const {fileInfo_root, fileInfo_0, fileInfo_1} = TV
    const {userOId_root, userOId_user_0, userOId_user_1, userOId_banned} = TV
    const {userInfo_root, userInfo_user_0, userInfo_user_1, userInfo_banned} = TV

    try {
      /**
       * 1. 유저 롤백
       *   - 수정됬을수도 있는 DB 의 내용을 저장된 내용으로 돌려놓는다.
       */
      const queryUserAdmin = `UPDATE users SET picture = ?, signUpType = ?, userId = ?, userName = ?, userAuth = ?, userMail = ? WHERE userOId = ?`

      const paramUserAdmin = [
        userInfo_root.picture,
        userInfo_root.signUpType,
        userInfo_root.userId,
        userInfo_root.userName,
        AUTH_ADMIN,
        userInfo_root.userMail,
        userOId_root
      ]
      const paramUserUser_0 = [
        userInfo_user_0.picture,
        userInfo_user_0.signUpType,
        userInfo_user_0.userId,
        userInfo_user_0.userName,
        AUTH_USER,
        userInfo_user_0.userMail,
        userOId_user_0
      ]
      const paramUserUser_1 = [
        userInfo_user_1.picture,
        userInfo_user_1.signUpType,
        userInfo_user_1.userId,
        userInfo_user_1.userName,
        AUTH_USER,
        userInfo_user_1.userMail,
        userOId_user_1
      ]
      const paramUserBanned = [
        userInfo_banned.picture,
        userInfo_banned.signUpType,
        userInfo_banned.userId,
        userInfo_banned.userName,
        AUTH_GUEST,
        userInfo_banned.userMail,
        userOId_banned
      ]
      await connection.execute(queryUserAdmin, paramUserAdmin)
      await connection.execute(queryUserAdmin, paramUserUser_0)
      await connection.execute(queryUserAdmin, paramUserUser_1)
      await connection.execute(queryUserAdmin, paramUserBanned)

      /**
       * 2. 디렉토리 롤백
       */
      const queryDir = `UPDATE directories SET dirName = ?, parentDirOId = ?, dirIdx = ?, fileArrLen = ?, subDirArrLen = ? WHERE dirOId = ?`

      const paramDirRoot = [
        dirInfo_root.dirName,
        dirInfo_root.parentDirOId,
        dirInfo_root.dirIdx,
        dirInfo_root.fileArrLen,
        dirInfo_root.subDirArrLen,
        dirOId_root
      ]
      const paramDir_0 = [
        dirInfo_0.dirName, // ::
        dirInfo_0.parentDirOId,
        dirInfo_0.dirIdx,
        dirInfo_0.fileArrLen,
        dirInfo_0.subDirArrLen,
        dirOId_0
      ]
      const paramDir_1 = [
        dirInfo_1.dirName, // ::
        dirInfo_1.parentDirOId,
        dirInfo_1.dirIdx,
        dirInfo_1.fileArrLen,
        dirInfo_1.subDirArrLen,
        dirOId_1
      ]

      await connection.execute(queryDir, paramDirRoot)
      await connection.execute(queryDir, paramDir_0)
      await connection.execute(queryDir, paramDir_1)

      /**
       * 3. 파일 롤백
       */
      const queryFile = `UPDATE files SET content = ?, dirOId = ?, fileIdx = ?, fileName = ?, fileStatus = ?, userName = ?, userOId = ? WHERE fileOId = ?`

      const paramFileRoot = [
        fileInfo_root.content,
        dirOId_root,
        fileInfo_root.fileIdx,
        fileInfo_root.fileName,
        fileInfo_root.fileStatus,
        fileInfo_root.userName,
        userOId_root,
        fileOId_root
      ]
      const paramFile_0 = [
        fileInfo_0.content,
        dirOId_0,
        fileInfo_0.fileIdx,
        fileInfo_0.fileName,
        fileInfo_0.fileStatus,
        fileInfo_0.userName,
        userOId_root,
        fileOId_0
      ]
      const paramFile_1 = [
        fileInfo_1.content,
        dirOId_1,
        fileInfo_1.fileIdx,
        fileInfo_1.fileName,
        fileInfo_1.fileStatus,
        fileInfo_1.userName,
        userOId_root,
        fileOId_1
      ]

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
    const {userOId_root, userOId_user_0, userOId_user_1, userOId_banned} = TV
    const {userInfo_root, userInfo_user_0, userInfo_user_1, userInfo_banned} = TV

    try {
      const query = `INSERT INTO users (userOId, hashedPassword, picture, signUpType, userId, userMail, userName, userAuth, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      const createdAt = new Date()
      const updatedAt = createdAt

      const paramBanned = [
        userOId_banned,
        bcrypt.hashSync(userInfo_banned.password, gkdSaltOrRounds),
        userInfo_banned.picture,
        userInfo_banned.signUpType,
        userInfo_banned.userId,
        userInfo_banned.userMail,
        userInfo_banned.userName,
        AUTH_GUEST,
        createdAt,
        updatedAt
      ]
      const paramUser_0 = [
        userOId_user_0,
        bcrypt.hashSync(userInfo_user_0.password, gkdSaltOrRounds),
        userInfo_user_0.picture,
        userInfo_user_0.signUpType,
        userInfo_user_0.userId,
        userInfo_user_0.userMail,
        userInfo_user_0.userName,
        AUTH_USER,
        createdAt,
        updatedAt
      ]
      const paramUser_1 = [
        userOId_user_1,
        bcrypt.hashSync(userInfo_user_1.password, gkdSaltOrRounds),
        userInfo_user_1.picture,
        userInfo_user_1.signUpType,
        userInfo_user_1.userId,
        userInfo_user_1.userMail,
        userInfo_user_1.userName,
        AUTH_USER,
        createdAt,
        updatedAt
      ]
      const paramRoot = [
        userOId_root,
        bcrypt.hashSync(userInfo_root.password, gkdSaltOrRounds),
        userInfo_root.picture,
        userInfo_root.signUpType,
        userInfo_root.userId,
        userInfo_root.userMail,
        userInfo_root.userName,
        AUTH_ADMIN,
        createdAt,
        updatedAt
      ]
      await connection.execute(query, paramBanned)
      await connection.execute(query, paramUser_0)
      await connection.execute(query, paramUser_1)
      await connection.execute(query, paramRoot)

      TestDB.usersCommon[AUTH_GUEST] = [
        {
          userOId: userOId_banned,
          userId: userInfo_banned.userId,
          userMail: userInfo_banned.userMail,
          userName: userInfo_banned.userName,
          picture: userInfo_banned.picture,
          userAuth: AUTH_GUEST,
          createdAt,
          updatedAt
        }
      ]
      TestDB.usersCommon[AUTH_USER] = [
        {
          userOId: userOId_user_0,
          userId: userInfo_user_0.userId,
          userMail: userInfo_user_0.userMail,
          userName: userInfo_user_0.userName,
          picture: userInfo_user_0.picture,
          userAuth: AUTH_USER,
          createdAt,
          updatedAt
        },
        {
          userOId: userOId_user_1,
          userId: userInfo_user_1.userId,
          userMail: userInfo_user_1.userMail,
          userName: userInfo_user_1.userName,
          picture: userInfo_user_1.picture,
          userAuth: AUTH_USER,
          createdAt,
          updatedAt
        }
      ]
      TestDB.usersCommon[AUTH_ADMIN] = [
        {
          userOId: userOId_root,
          userId: userInfo_root.userId,
          userMail: userInfo_root.userMail,
          userName: userInfo_root.userName,
          picture: userInfo_root.picture,
          userAuth: AUTH_ADMIN,
          createdAt,
          updatedAt
        }
      ]
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
    const {dirOId_root, dirOId_0, dirOId_1} = TV
    const {dirInfo_root, dirInfo_0, dirInfo_1} = TV
    try {
      /**
       * 1. DB 에 테스트용 디렉토리 생성
       *   - 루트 디렉토리
       *     - 디렉토리 인덱스: 0
       *     - 디렉토리 인덱스: 1
       */
      const query = `INSERT INTO directories (dirOId, dirIdx, dirName, parentDirOId, fileArrLen, subDirArrLen) VALUES (?, ?, ?, ?, ?, ?)`

      const paramRoot = [
        dirOId_root,
        dirInfo_root.dirIdx,
        dirInfo_root.dirName,
        dirInfo_root.parentDirOId,
        dirInfo_root.fileArrLen,
        dirInfo_root.subDirArrLen
      ]
      const paramDir_0 = [dirOId_0, dirInfo_0.dirIdx, dirInfo_0.dirName, dirInfo_0.parentDirOId, dirInfo_0.fileArrLen, dirInfo_0.subDirArrLen]
      const paramDir_1 = [dirOId_1, dirInfo_1.dirIdx, dirInfo_1.dirName, dirInfo_1.parentDirOId, dirInfo_1.fileArrLen, dirInfo_1.subDirArrLen]

      await connection.execute(query, paramRoot)
      await connection.execute(query, paramDir_0)
      await connection.execute(query, paramDir_1)

      // 2. 루트 디렉토리 설정
      TestDB.rootDir = {
        dirName: dirInfo_root.dirName,
        dirOId: dirOId_root,
        fileOIdsArr: [],
        parentDirOId: null,
        subDirOIdsArr: [dirOId_0, dirOId_1]
      }

      // 3. 디렉토리 객체 설정
      TestDB.directories[dirOId_root] = TestDB.rootDir
      TestDB.directories[dirOId_0] = {
        dirName: dirInfo_0.dirName,
        dirOId: dirOId_0,
        fileOIdsArr: [],
        parentDirOId: dirOId_root,
        subDirOIdsArr: []
      }
      TestDB.directories[dirOId_1] = {
        dirName: dirInfo_1.dirName,
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
    const {dirOId_root, dirOId_0, dirOId_1} = TV
    const {fileOId_root, fileOId_0, fileOId_1} = TV
    const {fileInfo_root, fileInfo_0, fileInfo_1} = TV
    try {
      /**
       * 1. 루트 폴더에 테스트용 파일 1개 생성
       * 2. 루트_0번째 폴더에 테스트용 파일 1개 생성
       * 3. 루트_1번째 폴더에 테스트용 파일 1개 생성
       */
      const query = `INSERT INTO files (fileOId, content, dirOId, fileIdx, fileName, fileStatus, userName, userOId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

      const {userName, userOId} = this.getUserCommon(AUTH_ADMIN).user

      const createdAt = new Date()

      const paramRoot = [
        fileOId_root,
        fileInfo_root.content,
        dirOId_root,
        fileInfo_root.fileIdx,
        fileInfo_root.fileName,
        fileInfo_root.fileStatus,
        userName,
        userOId,
        createdAt
      ]
      const paramDir_0 = [
        fileOId_0,
        fileInfo_0.content,
        dirOId_0,
        fileInfo_0.fileIdx,
        fileInfo_0.fileName,
        fileInfo_0.fileStatus,
        userName,
        userOId,
        createdAt
      ]
      const paramDir_1 = [
        fileOId_1,
        fileInfo_1.content,
        dirOId_1,
        fileInfo_1.fileIdx,
        fileInfo_1.fileName,
        fileInfo_1.fileStatus,
        userName,
        userOId,
        createdAt
      ]

      await connection.execute(query, paramRoot)
      await connection.execute(query, paramDir_0)
      await connection.execute(query, paramDir_1)

      // 4. 파일 객체 설정
      TestDB.files[fileOId_root] = {
        content: fileInfo_root.content,
        dirOId: dirOId_root,
        fileIdx: 0,
        fileOId: fileOId_root,
        fileStatus: 0,
        fileName: fileInfo_root.fileName,
        userName: userName,
        userOId: userOId,
        createdAt,
        updatedAt: createdAt
      }
      TestDB.files[fileOId_0] = {
        content: fileInfo_0.content,
        dirOId: dirOId_0,
        fileIdx: 0,
        fileOId: fileOId_0,
        fileStatus: 0,
        fileName: fileInfo_0.fileName,
        userName: userName,
        userOId: userOId,
        createdAt,
        updatedAt: createdAt
      }
      TestDB.files[fileOId_1] = {
        content: fileInfo_1.content,
        dirOId: dirOId_1,
        fileIdx: 0,
        fileOId: fileOId_1,
        fileStatus: 0,
        fileName: fileInfo_1.fileName,
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
    const {userOId_root, userOId_user_0, userOId_user_1, userOId_banned} = TV
    const {dirOId_root, dirOId_0, dirOId_1} = TV
    const {fileOId_root, fileOId_0, fileOId_1} = TV
    try {
      // 1. 테스트용 유저 삭제
      const query = `DELETE FROM users WHERE userOId IN (?, ?, ?, ?)`
      // ::

      const param = [userOId_banned, userOId_user_0, userOId_user_1, userOId_root]
      await connection.execute(query, param)

      // ::
      // 2. 테스트용 디렉토리 삭제
      const queryDir = `DELETE FROM directories WHERE dirOId IN (?, ?, ?)`

      const paramDir = [dirOId_root, dirOId_0, dirOId_1]
      await connection.execute(queryDir, paramDir)

      // ::
      // 3. 테스트용 파일 삭제
      const queryFile = `DELETE FROM files WHERE fileOId IN (?, ?, ?)`

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
