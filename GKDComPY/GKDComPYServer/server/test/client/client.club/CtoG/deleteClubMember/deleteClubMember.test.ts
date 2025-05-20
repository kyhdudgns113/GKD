import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {BlockedTrying, DeleteMember, TryToDifferentClub, TryToOtherComm} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class DeleteClubMember extends GKDTestBase {
  private blockTryDel: BlockedTrying
  private deleteMember: DeleteMember
  private tryToDifferentClub: TryToDifferentClub
  private tryToOtherComm: TryToOtherComm

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.blockTryDel = new BlockedTrying(REQUIRED_LOG_LEVEL + 1)
    this.deleteMember = new DeleteMember(REQUIRED_LOG_LEVEL + 1)
    this.tryToDifferentClub = new TryToDifferentClub(REQUIRED_LOG_LEVEL + 1)
    this.tryToOtherComm = new TryToOtherComm(REQUIRED_LOG_LEVEL + 1)
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
      await this.blockTryDel.testFail(db, logLevel)
      await this.deleteMember.testOK(db, logLevel)
      await this.tryToDifferentClub.testFail(db, logLevel)
      await this.tryToOtherComm.testFail(db, logLevel)
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
  const testModule = new DeleteClubMember(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
