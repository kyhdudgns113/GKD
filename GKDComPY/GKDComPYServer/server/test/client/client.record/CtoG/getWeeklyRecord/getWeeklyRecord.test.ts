import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {BlockedTrying, TryToOtherClub, WorkCorrect} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class GetWeeklyRecord extends GKDTestBase {
  private blockedTrying: BlockedTrying
  private tryToOtherClub: TryToOtherClub
  private workCorrect: WorkCorrect

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
    // BLANK LINE COMMENT:
    this.blockedTrying = new BlockedTrying(REQUIRED_LOG_LEVEL + 1)
    this.tryToOtherClub = new TryToOtherClub(REQUIRED_LOG_LEVEL + 1)
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
      // 이 함수는 읽기만 하는거라 권한값이 0이어도 수행되어야 한다.
      //   - 나중에 일반 멤버도 회원가입 시키는것 고려
      // 따라서 blockedTrying 이 그냥 통과되어야 한다.
      await this.blockedTrying.testOK(db, logLevel)
      await this.tryToOtherClub.testFail(db, logLevel)
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
  const testModule = new GetWeeklyRecord(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
