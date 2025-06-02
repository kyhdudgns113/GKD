/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {ClientPortServiceTest} from '../../../../../src/modules'
import {AUTH_ADMIN} from '../../../../../src/common/secret'
import {AddDirectoryDataType, JwtPayloadType} from '../../../../../src/common/types'
import {Types} from 'mongoose'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 다음 시나리오로 흘러간다.
 * 0. 기존 루트폴더 이름을 잠시 변경한다.
 *
 * 1. 새로운 루트 디렉토리를 만든다.
 * 2. 루트폴더에 하위폴더를 1개 만든다.
 * 3. 그 하위폴더에 폴더를 1개 만든다.
 * 4. 루트폴더에 2번째 하위폴더를 만든다.
 * 5. 그 폴더에 폴더를 1개 추가한다.
 * 6. 생성된 디렉토리 구조를 점검한다.
 */
export class WorkCompleted extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private subDirOId_1: string
  private subDirOId_1_1: string
  private subDirOId_2: string
  private subDirOId_2_1: string
  private jwtPayload: JwtPayloadType
  private newRootDirOId: string
  private prevRootDirName: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      /**
       * 1. jwtPayload 를 만든다.
       * 2. 기존의 루트 디렉토리 이름을 잠시 변경한다.
       * 3. 테스트 변수들을 설정한다.
       */

      // 1. jwtPayload 를 만든다.
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userName, signUpType, userOId} = user
      const jwtPayload: JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }

      // 2. 기존의 루트 디렉토리 이름을 잠시 변경한다.
      const {directory} = this.testDB.getRootDir()
      const {dirName} = directory
      await this.db.collection('directorydbs').updateOne({dirName}, {$set: {dirName: 'GROOT'}})

      // 3. 테스트 변수들을 설정한다.
      this.prevRootDirName = dirName
      this.jwtPayload = jwtPayload
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._1_createRootDir.bind(this), db, logLevel)
      await this.memberOK(this._2_createSubDir_1.bind(this), db, logLevel)
      await this.memberOK(this._3_createSubDir_1_1.bind(this), db, logLevel)
      await this.memberOK(this._4_createSubDir_2.bind(this), db, logLevel)
      await this.memberOK(this._5_createSubDir_2_1.bind(this), db, logLevel)
      await this.memberOK(this._6_checkEntireDirectory.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      // 1. 새로 만든 디렉토리들을 지운다.
      const {newRootDirOId, subDirOId_1, subDirOId_1_1, subDirOId_2, subDirOId_2_1} = this
      const _id = new Types.ObjectId(newRootDirOId)
      const _id_1 = new Types.ObjectId(subDirOId_1)
      const _id_1_1 = new Types.ObjectId(subDirOId_1_1)
      const _id_2 = new Types.ObjectId(subDirOId_2)
      const _id_2_1 = new Types.ObjectId(subDirOId_2_1)

      await this.db.collection('directorydbs').deleteOne({_id})
      await this.db.collection('directorydbs').deleteOne({_id: _id_1})
      await this.db.collection('directorydbs').deleteOne({_id: _id_1_1})
      await this.db.collection('directorydbs').deleteOne({_id: _id_2})
      await this.db.collection('directorydbs').deleteOne({_id: _id_2_1})

      // 2. 기존의 루트 디렉토리 이름을 원래대로 변경한다.
      await this.db.collection('directorydbs').updateOne({dirName: 'GROOT'}, {$set: {dirName: this.prevRootDirName}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * 루트 디렉토리를 만들 수 있나 테스트한다.
   * - 새로운 루트 디렉토리의 OId 를 테스트 변수에 저장한다.
   */
  private async _1_createRootDir(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const {directory: rootDir} = this.testDB.getRootDir()
      const {dirName, parentDirOId} = rootDir

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const dirOId = extraDirs.dirOIdsArr[0]

      this.newRootDirOId = dirOId

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _2_createSubDir_1(db: Db, logLevel: number) {
    try {
      const {jwtPayload, newRootDirOId} = this
      const dirName = `subDir_1`
      const parentDirOId = newRootDirOId

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

      const {dirOIdsArr, directories} = extraDirs

      const subDirOId = dirOIdsArr[1]
      this.subDirOId_1 = subDirOId

      /**
       * 1. root 디렉토리 정보를 제대로 가져오나 테스트
       *   1-1. root 의 OId 가 배열의 맨 앞에 있어야 한다.
       *   1-2. root 의 이름이 바뀌어서는 안된다.
       *   1-3. root 의 하위 디렉토리 배열이 제대로 생성되었는지 테스트
       *   1-4. root 디렉토리는 아직 자식파일이이 있으면 안된다.
       *   1-5. root 디렉토리의 부모는 NULL 이어야 한다.
       */
      const rootDir = directories[newRootDirOId]
      if (dirOIdsArr[0] !== newRootDirOId) throw `1-1. root 의 OId 가 배열의 맨 앞에 있어야 합니다.`
      if (rootDir.dirName !== 'root') throw `1-2. root 의 이름이 바뀌어서는 안됩니다.`
      if (rootDir.subDirOIdsArr.length !== 1) throw `1-3. root 의 하위 디렉토리 배열이 제대로 생성되어야 합니다.`
      if (rootDir.fileOIdsArr.length !== 0) throw `1-4. root 디렉토리는 아직 자식파일이 있으면 안됩니다.`
      if (rootDir.parentDirOId !== 'NULL') throw `1-5. root 디렉토리의 부모는 NULL 이어야 합니다.`

      /**
       * 2. 새로 생성한 서브 디렉토리를 제대로 가져오나 테스트
       *   2-1. 서브 디렉토리의 이름이 바뀌어서는 안된다.
       *   2-2. 서브 디렉토리의 부모 디렉토리가 제대로 설정되어야 한다.
       *   2-3. 서브 디렉토리 자식폴더가 있으면 안된다.
       *   2-4. 서브 데릭토리는 자식 파일도 있으면 안된다.
       *   2-5. 서브 디렉토리의 OID 가 루트의 첫 번째 자식폴더여야 한다.
       */

      if (directories[subDirOId].dirName !== dirName) throw `2-1. 처음 생성한 서브폴더가 두번째에 와야 합니다.`
      if (directories[subDirOId].parentDirOId !== newRootDirOId) throw `2-2. 서브 디렉토리의 부모 디렉토리가 제대로 설정되어야 합니다.`
      if (directories[subDirOId].subDirOIdsArr.length !== 0) throw `2-3. 서브 디렉토리 자식폴더가 있으면 안됩니다.`
      if (directories[subDirOId].fileOIdsArr.length !== 0) throw `2-4. 서브 데릭토리는 자식 파일도 있으면 안됩니다.`
      if (subDirOId !== rootDir.subDirOIdsArr[0]) throw `2-5. 서브 디렉토리의 OID 가 루트의 첫 번째 자식폴더여야 합니다.`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _3_createSubDir_1_1(db: Db, logLevel: number) {
    try {
      const {jwtPayload, newRootDirOId, subDirOId_1} = this
      const dirName = `subDir_1_1`
      const parentDirOId = subDirOId_1

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

      const {dirOIdsArr, directories} = extraDirs
      const subDirOId = dirOIdsArr[1]
      this.subDirOId_1_1 = subDirOId

      /**
       * 1. 부모 디렉토리의 정보를 제대로 가져오는지 테스트
       *   1-1. 부모 디렉토리의 OId 가 배열의 맨 앞에 있어야 한다.
       *   1-2. 부모 디렉토리의 이름이 바뀌어서는 안된다.
       *   1-3. 부모 디렉토리의 하위 디렉토리 배열이 제대로 생성되어야 한다.
       *   1.4. 부모 디렉토리는 자식파일이 있으면 안된다.
       *   1.5. 부모 디렉토리의 부모는 root 이어야 한다.
       */
      const parentDir = directories[parentDirOId]
      if (dirOIdsArr[0] !== parentDirOId) throw `1-1. 부모 디렉토리의 OId 가 배열의 맨 앞에 있어야 합니다.`
      if (parentDir.dirName !== 'subDir_1') throw `1-2. 부모 디렉토리의 이름이 바뀌어서는 안됩니다.`
      if (parentDir.subDirOIdsArr.length !== 1) throw `1-3. 부모 디렉토리의 하위 디렉토리 배열이 제대로 생성되어야 합니다.`
      if (parentDir.fileOIdsArr.length !== 0) throw `1-4. 부모 디렉토리는 자식파일이 있으면 안됩니다.`
      if (parentDir.parentDirOId !== newRootDirOId) throw `1-5. 부모 디렉토리의 부모는 root 이어야 합니다.`

      /**
       * 2. 새로 생성한 서브 디렉토리를 제대로 가져오는지 테스트
       *   2-1. 서브 디렉토리의 이름이 바뀌어서는 안된다.
       *   2-2. 서브 디렉토리의 부모 디렉토리가 제대로 설정되어야 한다.
       *   2-3. 서브 디렉토리 자식폴더가 있으면 안된다.
       *   2-4. 서브 데릭토리는 자식 파일도 있으면 안된다.
       *   2-5. 서브 디렉토리의 OID 가 루트의 첫 번째 자식폴더여야 한다.
       */
      if (directories[subDirOId].dirName !== dirName) throw `2-1. 처음 생성한 서브폴더가 두번째에 와야 합니다.`
      if (directories[subDirOId].parentDirOId !== subDirOId_1) throw `2-2. 서브 디렉토리의 부모 디렉토리가 제대로 설정되어야 합니다.`
      if (directories[subDirOId].subDirOIdsArr.length !== 0) throw `2-3. 서브 디렉토리 자식폴더가 있으면 안됩니다.`
      if (directories[subDirOId].fileOIdsArr.length !== 0) throw `2-4. 서브 데릭토리는 자식 파일도 있으면 안됩니다.`
      if (subDirOId !== parentDir.subDirOIdsArr[0]) throw `2-5. 서브 디렉토리의 OID 가 루트의 첫 번째 자식폴더여야 합니다.`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _4_createSubDir_2(db: Db, logLevel: number) {
    try {
      const {jwtPayload, newRootDirOId} = this
      const dirName = `subDir_2`
      const parentDirOId = newRootDirOId

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

      const {dirOIdsArr, directories} = extraDirs
      const subDirOId = dirOIdsArr[2]
      this.subDirOId_2 = subDirOId

      /**
       * 1. root 디렉토리 정보를 제대로 가져오나 테스트
       *   1-1. root 의 OId 가 배열의 맨 앞에 있어야 한다.
       *   1-2. root 의 이름이 바뀌어서는 안된다.
       *   1-3. root 의 하위 디렉토리 배열이 제대로 생성되었는지 테스트
       *   1-4. root 디렉토리는 아직 자식파일이이 있으면 안된다.
       *   1-5. root 디렉토리의 부모는 NULL 이어야 한다.
       */
      const rootDir = directories[newRootDirOId]
      if (dirOIdsArr[0] !== newRootDirOId) throw `1-1. root 의 OId 가 배열의 맨 앞에 있어야 합니다.`
      if (rootDir.dirName !== 'root') throw `1-2. root 의 이름이 바뀌어서는 안됩니다.`
      if (rootDir.subDirOIdsArr.length !== 2) throw `1-3. root 의 하위 디렉토리 배열이 제대로 생성되어야 합니다.`
      if (rootDir.fileOIdsArr.length !== 0) throw `1-4. root 디렉토리는 아직 자식파일이 있으면 안됩니다.`
      if (rootDir.parentDirOId !== 'NULL') throw `1-5. root 디렉토리의 부모는 NULL 이어야 합니다.`

      /**
       * 2. 새로 생성한 서브 디렉토리를 제대로 가져오나 테스트
       *   2-1. 서브 디렉토리의 이름이 바뀌어서는 안된다.
       *   2-2. 서브 디렉토리의 부모 디렉토리가 제대로 설정되어야 한다.
       *   2-3. 서브 디렉토리 자식폴더가 있으면 안된다.
       *   2-4. 서브 데릭토리는 자식 파일도 있으면 안된다.
       *   2-5. 서브 디렉토리의 OID 가 루트의 첫 번째 자식폴더여야 한다.
       */

      if (directories[subDirOId].dirName !== dirName) throw `2-1. 처음 생성한 서브폴더가 두번째에 와야 합니다.`
      if (directories[subDirOId].parentDirOId !== newRootDirOId) throw `2-2. 서브 디렉토리의 부모 디렉토리가 제대로 설정되어야 합니다.`
      if (directories[subDirOId].subDirOIdsArr.length !== 0) throw `2-3. 서브 디렉토리 자식폴더가 있으면 안됩니다.`
      if (directories[subDirOId].fileOIdsArr.length !== 0) throw `2-4. 서브 데릭토리는 자식 파일도 있으면 안됩니다.`
      if (subDirOId !== rootDir.subDirOIdsArr[1]) throw `2-5. 서브 디렉토리의 OID 가 루트의 두 번째 자식폴더여야 합니다.`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _5_createSubDir_2_1(db: Db, logLevel: number) {
    try {
      const {jwtPayload, newRootDirOId, subDirOId_2} = this
      const dirName = `subDir_2_1`
      const parentDirOId = subDirOId_2

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

      const {dirOIdsArr, directories} = extraDirs
      const subDirOId = dirOIdsArr[1]
      this.subDirOId_2_1 = subDirOId

      /**
       * 1. 부모 디렉토리의 정보를 제대로 가져오는지 테스트
       *   1-1. 부모 디렉토리의 OId 가 배열의 맨 앞에 있어야 한다.
       *   1-2. 부모 디렉토리의 이름이 바뀌어서는 안된다.
       *   1-3. 부모 디렉토리의 하위 디렉토리 배열이 제대로 생성되어야 한다.
       *   1.4. 부모 디렉토리는 자식파일이 있으면 안된다.
       *   1.5. 부모 디렉토리의 부모는 root 이어야 한다.
       */
      const parentDir = directories[parentDirOId]
      if (dirOIdsArr[0] !== parentDirOId) throw `1-1. 부모 디렉토리의 OId 가 배열의 맨 앞에 있어야 합니다.`
      if (parentDir.dirName !== 'subDir_2') throw `1-2. 부모 디렉토리의 이름이 바뀌어서는 안됩니다.`
      if (parentDir.subDirOIdsArr.length !== 1) throw `1-3. 부모 디렉토리의 하위 디렉토리 배열이 제대로 생성되어야 합니다.`
      if (parentDir.fileOIdsArr.length !== 0) throw `1-4. 부모 디렉토리는 자식파일이 있으면 안됩니다.`
      if (parentDir.parentDirOId !== newRootDirOId) throw `1-5. 부모 디렉토리의 부모는 root 이어야 합니다.`

      /**
       * 2. 새로 생성한 서브 디렉토리를 제대로 가져오는지 테스트
       *   2-1. 서브 디렉토리의 이름이 바뀌어서는 안된다.
       *   2-2. 서브 디렉토리의 부모 디렉토리가 제대로 설정되어야 한다.
       *   2-3. 서브 디렉토리 자식폴더가 있으면 안된다.
       *   2-4. 서브 데릭토리는 자식 파일도 있으면 안된다.
       *   2-5. 서브 디렉토리의 OID 가 루트의 첫 번째 자식폴더여야 한다.
       */
      if (directories[subDirOId].dirName !== dirName) throw `2-1. 처음 생성한 서브폴더가 두번째에 와야 합니다.`
      if (directories[subDirOId].parentDirOId !== subDirOId_2) throw `2-2. 서브 디렉토리의 부모 디렉토리가 제대로 설정되어야 합니다.`
      if (directories[subDirOId].subDirOIdsArr.length !== 0) throw `2-3. 서브 디렉토리 자식폴더가 있으면 안됩니다.`
      if (directories[subDirOId].fileOIdsArr.length !== 0) throw `2-4. 서브 데릭토리는 자식 파일도 있으면 안됩니다.`
      if (subDirOId !== parentDir.subDirOIdsArr[0]) throw `2-5. 서브 디렉토리의 OID 가 루트의 첫 번째 자식폴더여야 합니다.`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _6_checkEntireDirectory(db: Db, logLevel: number) {
    try {
      const {newRootDirOId, subDirOId_1, subDirOId_1_1, subDirOId_2, subDirOId_2_1} = this

      const {extraDirs, extraFiles} = await this.portService.GET_ENTIRE_DIRECTORY_INFO(this.constructor.name)

      const rootDir = extraDirs.directories[newRootDirOId]

      // 1. root 디렉토리 자체의 정보 확인
      if (!rootDir) throw `1-1. root 디렉토리가 존재하지 않습니다.`
      if (rootDir.dirName !== 'root') throw `1-2. root 디렉토리의 이름이 바뀌어서는 안됩니다.`
      if (rootDir.subDirOIdsArr.length !== 2) throw `1-3. root 디렉토리의 하위 디렉토리 배열이 제대로 생성되어야 합니다.`
      if (rootDir.fileOIdsArr.length !== 0) throw `1-4. root 디렉토리는 자식파일이 있으면 안됩니다.`
      if (rootDir.parentDirOId !== 'NULL') throw `1-5. root 디렉토리의 부모는 NULL 이어야 합니다.`
      if (rootDir.subDirOIdsArr[0] !== subDirOId_1) throw `1-6. root 디렉토리의 첫 번째 자식폴더는 subDir_1 이어야 합니다.`
      if (rootDir.subDirOIdsArr[1] !== subDirOId_2) throw `1-7. root 디렉토리의 두 번째 자식폴더는 subDir_2 이어야 합니다.`

      // 2. subDir_1 디렉토리 정보 확인
      const subDir_1 = extraDirs.directories[subDirOId_1]
      if (!subDir_1) throw `2-1. subDir_1 디렉토리가 존재하지 않습니다.`
      if (subDir_1.dirName !== 'subDir_1') throw `2-2. subDir_1 디렉토리의 이름이 바뀌어서는 안됩니다.`
      if (subDir_1.subDirOIdsArr.length !== 1) throw `2-3. subDir_1 디렉토리의 하위 디렉토리 배열이 제대로 생성되어야 합니다.`
      if (subDir_1.fileOIdsArr.length !== 0) throw `2-4. subDir_1 디렉토리는 자식파일이 있으면 안됩니다.`
      if (subDir_1.parentDirOId !== newRootDirOId) throw `2-5. subDir_1 디렉토리의 부모는 root 이어야 합니다.`
      if (subDir_1.subDirOIdsArr[0] !== subDirOId_1_1) throw `2-6. subDir_1 디렉토리의 첫 번째 자식폴더는 subDir_1_1 이어야 합니다.`

      // 3. subDir_1_1 디렉토리 정보 확인
      const subDir_1_1 = extraDirs.directories[subDirOId_1_1]
      if (!subDir_1_1) throw `3-1. subDir_1_1 디렉토리가 존재하지 않습니다.`
      if (subDir_1_1.dirName !== 'subDir_1_1') throw `3-2. subDir_1_1 디렉토리의 이름이 바뀌어서는 안됩니다.`
      if (subDir_1_1.subDirOIdsArr.length !== 0) throw `3-3. subDir_1_1 디렉토리의 하위 디렉토리 배열이 제대로 생성되어야 합니다.`
      if (subDir_1_1.fileOIdsArr.length !== 0) throw `3-4. subDir_1_1 디렉토리는 자식파일이 있으면 안됩니다.`
      if (subDir_1_1.parentDirOId !== subDirOId_1) throw `3-5. subDir_1_1 디렉토리의 부모는 subDir_1 이어야 합니다.`

      // 4. subDir_2 디렉토리 정보 확인
      const subDir_2 = extraDirs.directories[subDirOId_2]
      if (!subDir_2) throw `4-1. subDir_2 디렉토리가 존재하지 않습니다.`
      if (subDir_2.dirName !== 'subDir_2') throw `4-2. subDir_2 디렉토리의 이름이 바뀌어서는 안됩니다.`
      if (subDir_2.subDirOIdsArr.length !== 1) throw `4-3. subDir_2 디렉토리의 하위 디렉토리 배열이 제대로 생성되어야 합니다.`
      if (subDir_2.fileOIdsArr.length !== 0) throw `4-4. subDir_2 디렉토리는 자식파일이 있으면 안됩니다.`
      if (subDir_2.parentDirOId !== newRootDirOId) throw `4-5. subDir_2 디렉토리의 부모는 root 이어야 합니다.`
      if (subDir_2.subDirOIdsArr[0] !== subDirOId_2_1) throw `4-6. subDir_2 디렉토리의 첫 번째 자식폴더는 subDir_2_1 이어야 합니다.`

      // 5. subDir_2_1 디렉토리 정보 확인
      const subDir_2_1 = extraDirs.directories[subDirOId_2_1]
      if (!subDir_2_1) throw `5-1. subDir_2_1 디렉토리가 존재하지 않습니다.`
      if (subDir_2_1.dirName !== 'subDir_2_1') throw `5-2. subDir_2_1 디렉토리의 이름이 바뀌어서는 안됩니다.`
      if (subDir_2_1.subDirOIdsArr.length !== 0) throw `5-3. subDir_2_1 디렉토리의 하위 디렉토리 배열이 제대로 생성되어야 합니다.`
      if (subDir_2_1.fileOIdsArr.length !== 0) throw `5-4. subDir_2_1 디렉토리는 자식파일이 있으면 안됩니다.`
      if (subDir_2_1.parentDirOId !== subDirOId_2) throw `5-5. subDir_2_1 디렉토리의 부모는 subDir_2 이어야 합니다.`

      // 6. extraFiles 비어있는지 확인
      if (extraFiles.fileOIdsArr.length !== 0) throw `6-1. extraFiles 비어있어야 합니다.`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WorkCompleted(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
