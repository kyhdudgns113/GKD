import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {BlockedTryToRead, TryToOtherClub, WorkCorrect} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class GetWeekRowsArr extends GKDTestBase {
  private blockedTryToRead: BlockedTryToRead
  private tryToOtherClub: TryToOtherClub
  private workCorrect: WorkCorrect

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.blockedTryToRead = new BlockedTryToRead(REQUIRED_LOG_LEVEL + 1)
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
      await this.tryToOtherClub.testFail(db, logLevel)
      await this.blockedTryToRead.testFail(db, logLevel)
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
  const testModule = new GetWeekRowsArr(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
