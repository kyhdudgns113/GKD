import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {BlockedTrying, TryToDeleteOnlyInClub, TryToOtherClub, WorkCorrect} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class DeleteRowMember extends GKDTestBase {
  private tryToOtherClub: TryToOtherClub
  private tryToDeleteOnlyInClub: TryToDeleteOnlyInClub
  private blockedTrying: BlockedTrying
  private workCorrect: WorkCorrect

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.tryToOtherClub = new TryToOtherClub(REQUIRED_LOG_LEVEL + 1)
    this.tryToDeleteOnlyInClub = new TryToDeleteOnlyInClub(REQUIRED_LOG_LEVEL + 1)
    this.blockedTrying = new BlockedTrying(REQUIRED_LOG_LEVEL + 1)
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
      await this.tryToDeleteOnlyInClub.testOK(db, logLevel)
      await this.blockedTrying.testFail(db, logLevel)
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
  const testModule = new DeleteRowMember(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
