/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import {WorkCompleted} from './workCompleted'
import {WrongInputs} from './wrongInputs'
import {NoAuth} from './noAuth'
import {TryDuplicate} from './tryDuplicate'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class AddDirectory extends GKDTestBase {
  private WorkCompleted: WorkCompleted
  private WrongInputs: WrongInputs
  private NoAuth: NoAuth
  private TryDuplicate: TryDuplicate

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.WorkCompleted = new WorkCompleted(REQUIRED_LOG_LEVEL + 1)
    this.WrongInputs = new WrongInputs(REQUIRED_LOG_LEVEL + 1)
    this.NoAuth = new NoAuth(REQUIRED_LOG_LEVEL + 1)
    this.TryDuplicate = new TryDuplicate(REQUIRED_LOG_LEVEL + 1)
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
      await this.WorkCompleted.testOK(db, logLevel)
      await this.WrongInputs.testOK(db, logLevel)
      await this.NoAuth.testOK(db, logLevel)
      await this.TryDuplicate.testFail(db, logLevel)
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
  const testModule = new AddDirectory(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
