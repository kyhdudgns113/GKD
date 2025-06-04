/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {ClientPortServiceTest} from '../../../../../src/modules'
import {JwtPayloadType, AddFileDataType} from '../../../../../src/common/types'
import {AUTH_ADMIN} from '../../../../../src/common/secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 정상적인 입력이 들어왔을때 잘 완료되나 테스트한다.
 * - TestOK 로 실행한다.
 *
 * 기본 테스트 DB 를 다음과 같이 변경한다
 * - root
 *   - testDir_1
 *     - testFile_1_1
 *     - 새_파일_1 (추가, 이름은 적절히 다른걸로 설정한다.)
 *   - testFile_1
 *   - 새_파일_2 (추가, 이름은 적절히 다른걸로 설정한다.)
 *
 * 다음 시나리오로 테스트한다
 *  1. 새_파일_1 을 삭제한다.
 *  2. 새_파일_2 를 삭제한다.
 */
export class WorkCompleted extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType
  private fileOId_1_2: string
  private fileOId_2: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    /**
     * 기본 DB 에 파일 2개를 추가한다.
     * 1. 루트의 자식 디렉토리에 파일 1개를 추가한다.
     * 2. 루트에 파일 1개를 추가한다.
     */
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userOId, userId, userName, signUpType} = user
      this.jwtPayload = {
        userOId,
        userId,
        userName,
        signUpType
      }

      // 1. 루트의 자식 디렉토리에 파일 1개를 추가한다.
      const {directory: testDir_1} = this.testDB.getRootsSubDir()
      const data: AddFileDataType = {fileName: this.constructor.name + '_1_1', parentDirOId: testDir_1.dirOId}
      const {extraFileRows} = await this.portService.addFile(this.jwtPayload, data)
      const {fileOIdsArr, fileRows} = extraFileRows
      const fileOId_1_2 = fileOIdsArr.filter((fileOId: string) => fileRows[fileOId].name === this.constructor.name + '_1_1')[0]

      // 2. 루트에 파일 1개를 추가한다.
      const {directory: rootDir} = this.testDB.getRootDir()
      const data_root: AddFileDataType = {fileName: this.constructor.name + '_2', parentDirOId: rootDir.dirOId}
      const {extraFileRows: extraFileRows_root} = await this.portService.addFile(this.jwtPayload, data_root)
      const {fileOIdsArr: fileOIdsArr_root, fileRows: fileRows_root} = extraFileRows_root
      const fileOId_2 = fileOIdsArr_root.filter((fileOId: string) => fileRows_root[fileOId].name === this.constructor.name + '_2')[0]

      this.fileOId_1_2 = fileOId_1_2
      this.fileOId_2 = fileOId_2
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._1_try_delete_file_1_2.bind(this), db, logLevel)
      await this.memberOK(this._2_try_delete_file_2.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name + '_1_1'})
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name + '_2'})
      await this.testDB.resetBaseDB()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_try_delete_file_1_2() {
    /**
     * 루트의 자식폴더에 만들었던 파일을 삭제한다.
     *
     * 1. extraDirs 에 루트의 자식폴더가 존재하는지 확인한다.
     * 2. extraDirs 에 다른 디렉토리가 없어야 한다.
     * 3. extraDirs 로 받아온 루트의 서브디렉토리 정보를 확인한다.
     * 4. extraFileRows 에 원래 파일이 있어야 한다.
     * 5. extraFileRows 에 삭제한 파일이 없어야 한다.
     */
    try {
      const {jwtPayload, fileOId_1_2} = this
      const {extraDirs, extraFileRows} = await this.portService.deleteFile(jwtPayload, fileOId_1_2)

      const {directory: dir_1} = this.testDB.getRootsSubDir()
      const {dirOId: dirOId_1} = dir_1

      // 1. extraDirs 에 루트의 자식폴더가 존재하는지 확인한다.
      if (extraDirs.dirOIdsArr[0] !== dirOId_1) throw `1. 왜 루트의 자식폴더가 아니라 ${extraDirs.dirOIdsArr[0]} 이지?`

      // 2. extraDirs 에 다른 디렉토리가 없어야 한다.
      if (extraDirs.dirOIdsArr.length !== 1) throw `2. 왜 폴더 배열의 길이가 1이 아니라 ${extraDirs.dirOIdsArr.length} 이지?`

      /**
       * 3. extraDirs 로 받아온 루트의 서브디렉토리 정보를 확인한다.
       *   3-1. 서브디렉토리의 이름 확인
       *   3-2. 서브디렉토리의 자식 폴더 배열 확인
       *   3-3. 서브디렉토리의 파일 배열 확인
       */

      // 3-1. 서브디렉토리의 이름 확인
      const _dir_1 = extraDirs.directories[dirOId_1]
      if (_dir_1.dirName !== dir_1.dirName) throw `3-1. 왜 루트의 자식폴더의 이름이 바뀌었지? ${_dir_1.dirName} !== ${dir_1.dirName}`

      // 3-2. 서브디렉토리의 자식 폴더 배열 확인
      if (_dir_1.subDirOIdsArr.length !== 0) throw `3-2. 왜 루트의 자식폴더의 자식 폴더가 있지?`

      // 3-3. 서브디렉토리의 파일 배열 확인
      if (_dir_1.fileOIdsArr.length !== 1) throw `3-3. 왜 파일 배열의 길이가 1이 아니라 ${_dir_1.fileOIdsArr.length} 이지?`

      /**
       * 4. extraFileRows 에 원래 파일이 있어야 한다.
       *   4-1. 파일 OID 확인
       *   4-2. 파일 이름 확인
       */
      const fileOId_1_1 = dir_1.fileOIdsArr[0]

      // 4-1. 파일 OID 확인
      if (fileOId_1_1 !== _dir_1.fileOIdsArr[0]) throw `4-1. 왜 파일 OID 가 다르지? ${fileOId_1_1} !== ${_dir_1.fileOIdsArr[0]}`

      // 4-2. 파일 이름 확인
      const {file: file_1_1} = this.testDB.getFile(fileOId_1_1)
      if (extraFileRows.fileRows[fileOId_1_1].name !== file_1_1.name)
        throw `4-2. 왜 파일 이름이 바뀌었지? ${extraFileRows[fileOId_1_1].name} !== ${this.constructor.name + '_1_1'}`

      // 5. extraFileRows 에 삭제한 파일이 없어야 한다.
      if (extraFileRows.fileRows[fileOId_1_2]) throw `5. 왜 삭제한 파일이 있지?`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _2_try_delete_file_2() {
    try {
      const {jwtPayload, fileOId_2} = this
      const {extraDirs, extraFileRows} = await this.portService.deleteFile(jwtPayload, fileOId_2)

      this.logMessage(`${this._2_try_delete_file_2.name} 구현 더 해야됨`, 0)
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
