/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/database'
import {AddDirectoryDataType, JwtPayloadType} from '@common/types'
import {AUTH_GUEST, AUTH_USER} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 권한 없는 토큰으로 디렉토리 생성 시도
 * - 루트 디렉토리에 생성을 시도한다.
 * - 하위 테스트들을 점검해야 성공이다.
 *   - 이 테스트는 TestOK 로 실행해야 한다.
 * - userAuth === AUTH_GUEST 는 회원가입이 안된다.
 *
 * 1. userAuth === AUTH_USER 인 경우 테스트한다.
 */
export class NoAuth extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private parentDirOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      this.parentDirOId = this.testDB.getRootDir().directory.dirOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_normal_member_trying.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('directories').deleteOne({dirName: this.constructor.name})
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _1_normal_member_trying(db: Db, logLevel: number) {
    try {
      const {parentDirOId} = this
      const {userId, userName, signUpType, userOId} = this.testDB.getLocalUser(AUTH_USER).user

      const dirName = this.constructor.name

      const jwtPayload: JwtPayloadType = {
        userId,
        userName,
        signUpType,
        userOId
      }

      const data: AddDirectoryDataType = {
        parentDirOId,
        dirName
      }

      await this.portService.addDirectory(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new NoAuth(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
