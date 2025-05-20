import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {
  AddAlreadyInClub,
  AddAlreadyInRow,
  AddMultiple,
  AddNewMember,
  AddToOther,
  BlockedTryToAdd
} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class AddRowMember extends GKDTestBase {
  private addAlreadyInClub: AddAlreadyInClub
  private addAlreadyInRow: AddAlreadyInRow
  private addMultiple: AddMultiple
  private addNewMember: AddNewMember
  private addToOther: AddToOther
  private blockedTryToAdd: BlockedTryToAdd

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.addAlreadyInClub = new AddAlreadyInClub(REQUIRED_LOG_LEVEL + 1)
    this.addAlreadyInRow = new AddAlreadyInRow(REQUIRED_LOG_LEVEL + 1)
    this.addMultiple = new AddMultiple(REQUIRED_LOG_LEVEL + 1)
    this.addNewMember = new AddNewMember(REQUIRED_LOG_LEVEL + 1)
    this.addToOther = new AddToOther(REQUIRED_LOG_LEVEL + 1)
    this.blockedTryToAdd = new BlockedTryToAdd(REQUIRED_LOG_LEVEL + 1)
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
      await this.addAlreadyInClub.testOK(db, logLevel)
      await this.addAlreadyInRow.testFail(db, logLevel)
      await this.addMultiple.testOK(db, logLevel)
      await this.addNewMember.testOK(db, logLevel)
      await this.addToOther.testFail(db, logLevel)
      await this.blockedTryToAdd.testFail(db, logLevel)
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
  const testModule = new AddRowMember(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
