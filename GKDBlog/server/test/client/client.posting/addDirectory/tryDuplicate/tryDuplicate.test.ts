/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {ClientPortServiceTest} from '../../../../../src/modules'
import {AddDirectoryDataType, JwtPayloadType} from '../../../../../src/common/types'
import {AUTH_ADMIN} from '../../../../../src/common/secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 0

/**
 * 부모폴더 내에서 이름이 중복된 경우를 테스트한다.
 * - 루트 디렉토리에서 시도한다.
 * 이 테스트는 하위테스트가 없다.
 * - testFail 로 실행한다.
 */
export class TryDuplicate extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {userId, userName, signUpType, userOId} = this.testDB.getLocalUser(AUTH_ADMIN).user

      this.jwtPayload = {
        userId,
        userName,
        signUpType,
        userOId
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const {directory: rootDir} = this.testDB.getRootDir()

      const dirName = this.constructor.name

      const data: AddDirectoryDataType = {
        parentDirOId: rootDir.dirOId,
        dirName
      }

      await this.portService.addDirectory(jwtPayload, data)
      await this.portService.addDirectory(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      // 중복된 이름을 시도하기에 테스트가 실패했을시 같은 이름의 디렉토리가 2개 생성된다.
      await this.db.collection('directorydbs').deleteMany({dirName: this.constructor.name})
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
  const testModule = new TryDuplicate(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testFail(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
