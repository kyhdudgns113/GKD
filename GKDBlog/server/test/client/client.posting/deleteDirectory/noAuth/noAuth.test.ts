/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {AUTH_ADMIN, AUTH_USER} from '../../../../../src/common/secret'
import {AddFileDataType, JwtPayloadType} from '../../../../../src/common/types'
import {ClientPortServiceTest} from '../../../../../src/modules'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 권한이 없는 경우에 시도하는것을 테스트한다.
 * - 루트 디렉토리에서 시도한다.
 * - 각 권한별로 세부 테스트를 확인한다.
 * - 따라서 이 테스트는 TestOK 로 실행되어야 한다.
 */
export class NoAuth extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private fileName: string
  private fileOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userName, signUpType, userOId} = user
      const jwtPayload: JwtPayloadType = {userId, userName, signUpType, userOId}

      const {directory: rootDir} = this.testDB.getRootDir()

      const {dirOId: parentDirOId} = rootDir
      const fileName = `deleteDirectory-${this.constructor.name}`

      const data: AddFileDataType = {parentDirOId, fileName}
      const {extraFileRows} = await this.portService.addFile(jwtPayload, data)

      // 넣은 파일을 파일 이름으로 찾고, 그 OID 를 가져온다.
      const fileOId = extraFileRows.fileOIdsArr.filter(fileOId => extraFileRows.fileRows[fileOId].name === fileName)[0]

      this.fileName = fileName
      this.fileOId = fileOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_try_AUTH_USER.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {fileName} = this
      await this.db.collection('filedbs').deleteOne({name: fileName})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_try_AUTH_USER(db: Db, logLevel: number) {
    try {
      const {fileOId} = this
      const {user} = this.testDB.getLocalUser(AUTH_USER)
      const {userId, userName, signUpType, userOId} = user
      const jwtPayload: JwtPayloadType = {userId, userName, signUpType, userOId}

      await this.portService.deleteFile(jwtPayload, fileOId)
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
  const testModule = new NoAuth(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
