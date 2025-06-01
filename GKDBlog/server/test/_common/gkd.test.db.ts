import mongoose from 'mongoose'
import {AUTH_VAL_ARR, AUTH_GUEST, gkdSaltOrRounds} from '../../src/common/secret'
import type {Types} from 'mongoose'

import * as bcrypt from 'bcrypt'
import * as T from '../../src/common/types'

export class TestDB {
  private static db: mongoose.mongo.Db = null

  private static directories: {[dirOId: string]: T.DirectoryType} = {}
  private static files: {[fileOId: string]: T.FileType} = {}
  private static rootDir: T.DirectoryType = {
    dirName: 'root',
    dirOId: 'NULL',
    fileOIdsArr: [],
    parentDirOId: 'NULL',
    subDirOIdsArr: []
  }
  private static localUsers: {[userAuth: number]: T.UserType} = {}

  constructor() {}

  async cleanUpDB() {
    if (TestDB.db === null) return

    try {
      await this._deleteDBs()

      await this._checkRemainDB()

      console.log('DB 가 리셋되었습니다.')
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    } finally {
      // BLANK LINE COMMENT:
      TestDB.db = null
      // BLANK LINE COMMENT:
    }
  }
  async initTestDB(db: mongoose.mongo.Db) {
    try {
      if (TestDB.db !== null) return
      console.log(`DB 가 초기화 되고 있습니다...`)
      TestDB.db = db

      /**
       * 1. 테스트용 기본 유저(로컬) 생성
       * 2. 테스트용 기본 디렉토리 생성
       * 3. 테스트용 기본 파일 생성
       */
      await this._createLocalUsers()
      await this._createDirectories()
      await this._createFiles()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  public getLocalUser(userAuth: number) {
    return {user: TestDB.localUsers[userAuth]}
  }
  public getRootDir() {
    return {directory: TestDB.rootDir}
  }
  public getRootsFile() {
    return {file: TestDB.files[TestDB.rootDir.fileOIdsArr[0]]}
  }
  public getRootsSubDir() {
    return {directory: TestDB.directories[TestDB.rootDir.subDirOIdsArr[0]]}
  }
  public getRootsSubDirFile() {
    return {file: TestDB.files[TestDB.directories[TestDB.rootDir.subDirOIdsArr[0]].fileOIdsArr[0]]}
  }
  public getDirectory(dirOId: string) {
    return {directory: TestDB.directories[dirOId]}
  }
  public getFile(fileOId: string) {
    return {file: TestDB.files[fileOId]}
  }

  private async _createLocalUsers() {
    try {
      await Promise.all(
        AUTH_VAL_ARR.map(async userAuth => {
          if (userAuth === AUTH_GUEST) return

          const userId = `testUser_${userAuth}`
          const userName = `testUserName_${userAuth}`
          const signUpType = 'local'
          const hashedPassword = await bcrypt.hash(`testPassword${userAuth}!`, gkdSaltOrRounds)

          const userDB = await TestDB.db.collection('users').insertOne({userId, userName, userAuth, signUpType, hashedPassword})

          const userOId = userDB.insertedId.toString()
          const user: T.UserType = {
            userAuth,
            userId,
            userName,
            userOId,
            signUpType
          }
          TestDB.localUsers[userAuth] = user
        })
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _createDirectories() {
    /**
     * 1. 루트 디렉토리 생성
     * 2. 루트 디렉토리 하위 디렉토리 1개개생성
     */
    try {
      const rootDirDB = await TestDB.db.collection('directories').insertOne({
        dirName: 'root',
        fileOIdsArr: [],
        parentDirOId: 'NULL',
        subDirOIdsArr: []
      })
      const rootDirOId = rootDirDB.insertedId.toString()
      TestDB.rootDir.dirName = 'root'
      TestDB.rootDir.dirOId = rootDirOId
      TestDB.rootDir.fileOIdsArr = []
      TestDB.rootDir.parentDirOId = 'NULL'
      TestDB.rootDir.subDirOIdsArr = []

      const subDirDB = await TestDB.db.collection('directories').insertOne({
        dirName: 'testDir_1',
        fileOIdsArr: [],
        parentDirOId: rootDirOId,
        subDirOIdsArr: []
      })
      const subDirOId = subDirDB.insertedId.toString()

      TestDB.rootDir.subDirOIdsArr.push(subDirOId)

      await TestDB.db.collection('directories').updateOne({dirName: 'root'}, {$set: {subDirOIdsArr: TestDB.rootDir.subDirOIdsArr}})

      TestDB.directories[rootDirOId] = TestDB.rootDir
      TestDB.directories[subDirOId] = {
        dirName: 'testDir_1',
        dirOId: subDirOId,
        fileOIdsArr: [],
        parentDirOId: rootDirOId,
        subDirOIdsArr: []
      }

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _createFiles() {
    try {
      /**
       * 1. 루트 디렉토리에 있을 파일 생성
       * 2. 루트 디렉토리 하위 디렉토리에 있을 파일 생성
       */

      // 1. 루트 디렉토리에 있을 파일 생성
      const testFileDB = await TestDB.db.collection('files').insertOne({
        contentsArr: [
          {type: 'string', value: 'testContent_1_1'},
          {type: 'string', value: 'testContent_1_2'},
          {type: 'string', value: 'testContent_1_3'}
        ],
        name: 'testFile_1',
        parentDirOId: TestDB.rootDir.dirOId
      })
      const testFileOId = testFileDB.insertedId.toString()
      TestDB.files[testFileOId] = {
        contentsArr: [
          {type: 'string', value: 'testContent_1_1'},
          {type: 'string', value: 'testContent_1_2'},
          {type: 'string', value: 'testContent_1_3'}
        ],
        name: 'testFile_1',
        parentDirOId: TestDB.rootDir.dirOId,
        fileOId: testFileOId
      }
      // 1.1 루트 디렉토리에 파일 추가
      await TestDB.db.collection('directories').updateOne({dirOId: TestDB.rootDir.dirOId}, {$set: {fileOIdsArr: [testFileOId]}})

      // 2. 루트 디렉토리 하위 디렉토리에 있을 파일 생성
      const testFileDB2 = await TestDB.db.collection('files').insertOne({
        contentsArr: [
          {type: 'string', value: 'testContent_1_1_1'},
          {type: 'string', value: 'testContent_1_1_2'},
          {type: 'string', value: 'testContent_1_1_3'}
        ],
        name: 'testFile_1_1',
        parentDirOId: TestDB.rootDir.subDirOIdsArr[0]
      })
      const testFileOId2 = testFileDB2.insertedId.toString()
      TestDB.files[testFileOId2] = {
        contentsArr: [
          {type: 'string', value: 'testContent_1_1_1'},
          {type: 'string', value: 'testContent_1_1_2'},
          {type: 'string', value: 'testContent_1_1_3'}
        ],
        name: 'testFile_1_1',
        parentDirOId: TestDB.rootDir.subDirOIdsArr[0],
        fileOId: testFileOId2
      }
      // 2.1 루트 디렉토리 하위 디렉토리에 파일 추가
      await TestDB.db.collection('directories').updateOne({dirOId: TestDB.rootDir.subDirOIdsArr[0]}, {$set: {fileOIdsArr: [testFileOId2]}})

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _deleteDBs() {
    try {
      /**
       * 1. 테스트용 기본 유저(로컬) 삭제
       * 2. 테스트용 기본 디렉토리 삭제
       * 3. 테스트용 기본 파일 삭제
       */

      /* 1. 테스트용 기본 유저(로컬) 삭제 */
      await Promise.all(
        Object.values(TestDB.localUsers).map(async user => {
          const {userId} = user
          await TestDB.db.collection('users').deleteOne({userId})
        })
      )

      /* 2. 테스트용 기본 디렉토리 삭제 */
      await Promise.all(
        Object.values(TestDB.directories).map(async dir => {
          const {dirName} = dir
          await TestDB.db.collection('directories').deleteOne({dirName})
        })
      )

      /* 3. 테스트용 기본 파일 삭제 */
      await Promise.all(
        Object.values(TestDB.files).map(async file => {
          const {name} = file
          await TestDB.db.collection('files').deleteOne({name})
        })
      )

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _checkRemainDB() {
    try {
      const db = TestDB.db

      const userArrDB = await db.collection('users').find({}).toArray()
      const dirArrDB = await db.collection('directories').find({}).toArray()
      const fileArrDB = await db.collection('files').find({}).toArray()

      if (userArrDB.length > 0) {
        userArrDB.forEach(user => console.log(`유저가 남아있어요: ${user.userId}`))
      }

      if (dirArrDB.length > 0) {
        dirArrDB.forEach(dir => console.log(`디렉토리가 남아있어요: ${dir.dirName}`))
      }

      if (fileArrDB.length > 0) {
        fileArrDB.forEach(file => console.log(`파일이 남아있어요: ${file.name}`))
      }

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      console.log(errObj)
      throw errObj
    }
  }
}
