/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {BlockedTrying, CatchErrorPos, TryOtherClub, WorkCorrect} from './tests'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class SetMemPos extends GKDTestBase {
  private blockedTrying: BlockedTrying
  private catchErrorPos: CatchErrorPos
  private tryOtherClub: TryOtherClub
  private workCorrect: WorkCorrect

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.blockedTrying = new BlockedTrying(REQUIRED_LOG_LEVEL + 1)
    this.catchErrorPos = new CatchErrorPos(REQUIRED_LOG_LEVEL + 1)
    this.tryOtherClub = new TryOtherClub(REQUIRED_LOG_LEVEL + 1)
    this.workCorrect = new WorkCorrect(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.blockedTrying.testFail(db, logLevel)
      // // 잘못된 입력을 여러개 테스트한다. -> test 로 돌려야 한다.
      await this.catchErrorPos.testOK(db, logLevel)
      await this.tryOtherClub.testFail(db, logLevel)
      await this.workCorrect.testOK(db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
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
  const testModule = new SetMemPos(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
