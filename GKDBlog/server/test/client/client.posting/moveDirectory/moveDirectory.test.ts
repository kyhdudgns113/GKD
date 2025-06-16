/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import {NoAuth} from './noAuth'
import {WrongInputs} from './wrongInputs'
import {SameParents} from './sameParents'
import {ChangeParents} from './changeParents'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class MoveDirectory extends GKDTestBase {
  private NoAuth: NoAuth
  private WrongInputs: WrongInputs
  private SameParents: SameParents
  private ChangeParents: ChangeParents

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.NoAuth = new NoAuth(REQUIRED_LOG_LEVEL + 1)
    this.WrongInputs = new WrongInputs(REQUIRED_LOG_LEVEL + 1)
    this.SameParents = new SameParents(REQUIRED_LOG_LEVEL + 1)
    this.ChangeParents = new ChangeParents(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      // 1. 권한 없이 시도하는 경우
      // 2. 잘못된 입력으로 시도하는 경우
      // 3. 부모 디렉토리가 바뀌지 않는 경우
      // 4. 부모 디렉토리를 바꾸려고 하는 경우
      await this.NoAuth.testOK(db, logLevel)
      await this.WrongInputs.testOK(db, logLevel)
      await this.SameParents.testOK(db, logLevel)
      await this.ChangeParents.testOK(db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new MoveDirectory(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
