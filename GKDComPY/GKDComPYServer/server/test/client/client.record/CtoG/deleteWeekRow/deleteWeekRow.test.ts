import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {BlockedTrying, SingleDone, TryingError, TryToOtherClub} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class DeleteWeekRow extends GKDTestBase {
  private blockedTrying: BlockedTrying
  private tryToOtherClub: TryToOtherClub
  private tryingError: TryingError
  private singleDone: SingleDone

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.blockedTrying = new BlockedTrying(REQUIRED_LOG_LEVEL + 1)
    this.tryToOtherClub = new TryToOtherClub(REQUIRED_LOG_LEVEL + 1)
    this.tryingError = new TryingError(REQUIRED_LOG_LEVEL + 1)
    this.singleDone = new SingleDone(REQUIRED_LOG_LEVEL + 1)
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
      await this.tryToOtherClub.testFail(db, logLevel)
      await this.tryingError.testFail(db, logLevel)
      await this.singleDone.testOK(db, logLevel)
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
  const testModule = new DeleteWeekRow(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
