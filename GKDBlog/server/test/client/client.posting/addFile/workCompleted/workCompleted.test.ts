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
import {AddFileDataType, JwtPayloadType} from '../../../../../src/common/types'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * addFile 이 올바른 조건에서 실행이 되는지 하위 테스트들을 통해 점검한다.
 * 1. root 에서 잘 만들어지나
 * 2. root 에 파일을 또 만들때 잘 만들어지나
 * 3. root 의 자식폴더에 잘 만들어지나
 * 4. root 의 자식폴더에 root 에 넣은것과 같은 이름으로 잘 만들어지나
 */
export class WorkCompleted extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType

  private name_1: string
  private name_2: string
  private name_1_1: string
  private name_1_2: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userName, userOId, signUpType} = user
      this.jwtPayload = {userId, userName, userOId, signUpType}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._1_create_in_root.bind(this), db, logLevel)
      await this.memberOK(this._2_create_in_root_more.bind(this), db, logLevel)
      await this.memberOK(this._3_create_in_sub_dir.bind(this), db, logLevel)
      await this.memberOK(this._4_create_same_name_diff_dir.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('filedbs').deleteOne({name: this.name_1})
      await this.db.collection('filedbs').deleteOne({name: this.name_2})
      await this.db.collection('filedbs').deleteOne({name: this.name_1_1})
      await this.db.collection('filedbs').deleteOne({name: this.name_1_2})
      await this.testDB.resetBaseDB()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_create_in_root(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const {directory} = this.testDB.getRootDir()

      const parentDirOId = directory.dirOId
      const fileName = this._1_create_in_root.name

      const data: AddFileDataType = {fileName, parentDirOId}

      const {extraDirs, extraFileRows} = await this.portService.addFile(jwtPayload, data)
      this.name_1 = fileName

      /**
       * 1. extraDirs 잘 불러오나 확인한다.
       * 2. fileOId 배열 순서 바뀌면 안된다.
       * 3. 기존 파일의 정보가 바뀌면 안된다.
       * 4. 새로 생성한 파일은 올바른 정보가 입력되어야 한다.
       */
      const rootDir = directory
      const _rootDir = extraDirs.directories[extraDirs.dirOIdsArr[0]]

      /**
       * 1. extraDirs 잘 불러오나 확인한다.
       *  1-1. root 디렉토리만 불러왔나 확인한다.
       *  1-2. root 디렉토리 정보 확인: 이름
       *  1-3. root 디렉토리 정보 확인: 부모 디렉토리 OId
       *  1-4. root 디렉토리 정보 확인: 자식 디렉토리 배열 길이
       *  1-5. root 디렉토리 정보 확인: 파일 배열 길이
       */

      // 1-1. root 디렉토리만 불러왔나 확인한다.
      if (extraDirs.dirOIdsArr.length !== 1) throw `1-1. 디렉토리 배열 길이가 1 이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`

      // 1-2. root 디렉토리 정보 확인: 이름
      if (_rootDir.dirName !== 'root') throw `1-2. root 디렉토리 이름이 root 가 아닌 ${_rootDir.dirName} 이다.`

      // 1-3. root 디렉토리 정보 확인: 부모 디렉토리 OId
      if (_rootDir.parentDirOId !== 'NULL') throw `1-3. root 디렉토리의 부모 디렉토리 OId 가 NULL 이 아닌 ${_rootDir.parentDirOId} 이다.`

      // 1-4. root 디렉토리 정보 확인: 자식 디렉토리 배열 길이
      if (_rootDir.subDirOIdsArr.length !== 1) throw `1-4. root 디렉토리의 자식 디렉토리 배열 길이가 1 이 아닌 ${_rootDir.subDirOIdsArr.length} 이다.`

      // 1-5. root 디렉토리 정보 확인: 파일 배열 길이
      if (_rootDir.fileOIdsArr.length !== 2) throw `1-5. root 디렉토리의 파일 배열 길이가 2 가 아닌 ${_rootDir.fileOIdsArr.length} 이다.`

      /**
       * 2. fileOId 배열 순서 바뀌면 안된다.
       */
      const {file: rootsFile} = this.testDB.getRootsFile()
      if (_rootDir.fileOIdsArr[0] !== rootsFile.fileOId) throw `2-1. 파일 배열 순서가 바뀌었다.`

      /**
       * 3. 기존 파일의 정보가 바뀌면 안된다.
       *  3-2. 기존 파일의 정보 확인: 이름
       *  3-3. 기존 파일의 정보 확인: 부모 디렉토리 OId
       */
      const _rootsFileOId = _rootDir.fileOIdsArr[0]
      const _rootsFileRow = extraFileRows.fileRows[_rootsFileOId]

      if (_rootsFileRow.name !== rootsFile.name) throw `3-1. 기존 파일의 이름이 바뀌었다.`
      if (_rootsFileRow.fileOId !== _rootsFileOId) throw `3-2. OID 가 왜 바뀌냐`

      /**
       * 4. 새로 생성한 파일은 올바른 정보가 입력되어야 한다.
       *  4-1. 새로 생성한 파일의 정보 확인: 이름
       */
      const _newFileOId = _rootDir.fileOIdsArr[1]
      const _newFileRow = extraFileRows.fileRows[_newFileOId]

      if (_newFileRow.name !== fileName) throw `4-1. 새로 생성한 파일의 이름이 바뀌었다.`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _2_create_in_root_more(db: Db, logLevel: number) {
    try {
      /**
       * 1. extraDirs 정보 확인
       * 2. extraFileRows 정보 확인
       *
       * 중복 점검을 하진 않는다.
       */
      const {jwtPayload} = this
      const {directory} = this.testDB.getRootDir()

      const parentDirOId = directory.dirOId
      const fileName = this._2_create_in_root_more.name
      this.name_2 = fileName

      const data: AddFileDataType = {fileName, parentDirOId}

      const {extraDirs, extraFileRows} = await this.portService.addFile(jwtPayload, data)

      /**
       * 1. extraDirs 정보 확인
       *  - directory 에서 fileOIdsArr 잘 왔나 확인
       */
      const _rootDir = extraDirs.directories[extraDirs.dirOIdsArr[0]]
      if (_rootDir.fileOIdsArr.length !== 3) throw `1-1. root 디렉토리의 파일 배열 길이가 3 이 아닌 ${_rootDir.fileOIdsArr.length} 이다.`

      /**
       * 2. extraFileRows 정보 확인
       *   2-1. 배열 길이 확인
       *   2-2. 새로 생성한 파일정보 잘 읽어오나 확인
       */

      // 2-1. 배열 길이 확인
      if (extraFileRows.fileOIdsArr.length !== 3) throw `2-1. 배열 길이가 3 이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`

      // 2-2. 새로 생성한 파일정보 잘 읽어오나 확인
      const _newFileOId = extraFileRows.fileOIdsArr[2]
      const _newFileRow = extraFileRows.fileRows[_newFileOId]

      if (_newFileRow.name !== fileName) throw `2-2. 새로 생성한 파일의 이름이 바뀌었다.`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _3_create_in_sub_dir(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const {directory} = this.testDB.getRootDir()

      const parentDirOId = directory.dirOId
      const fileName = this._3_create_in_sub_dir.name

      const data: AddFileDataType = {fileName, parentDirOId}

      await this.portService.addFile(jwtPayload, data)
      this.name_1_1 = fileName

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _4_create_same_name_diff_dir(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const {directory} = this.testDB.getRootsSubDir()

      const parentDirOId = directory.dirOId
      const fileName = this._1_create_in_root.name

      const data: AddFileDataType = {fileName, parentDirOId}

      await this.portService.addFile(jwtPayload, data)
      this.name_1_2 = fileName
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
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
