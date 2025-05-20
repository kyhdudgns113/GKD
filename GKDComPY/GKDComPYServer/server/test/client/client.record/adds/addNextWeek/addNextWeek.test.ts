import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {AddMultipleWeek, AddNewWeek, AddToOtherClub, BlockedTryToAdd} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class AddNextWeek extends GKDTestBase {
  private addMultipleWeek: AddMultipleWeek
  private addNewWeek: AddNewWeek
  private addToOtherClub: AddToOtherClub
  private blockedTryToAdd: BlockedTryToAdd

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.addMultipleWeek = new AddMultipleWeek(REQUIRED_LOG_LEVEL + 1)
    this.addNewWeek = new AddNewWeek(REQUIRED_LOG_LEVEL + 1)
    this.addToOtherClub = new AddToOtherClub(REQUIRED_LOG_LEVEL + 1)
    this.blockedTryToAdd = new BlockedTryToAdd(REQUIRED_LOG_LEVEL + 1)
  }

  protected async finishTest(db: Db, logLevel: number) {
    try {
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.addMultipleWeek.testOK(db, logLevel)
      await this.addNewWeek.testOK(db, logLevel)
      await this.addToOtherClub.testFail(db, logLevel)
      await this.blockedTryToAdd.testFail(db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async beforeTest(db: Db, logLevel: number) {
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
  const testModule = new AddNextWeek(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
