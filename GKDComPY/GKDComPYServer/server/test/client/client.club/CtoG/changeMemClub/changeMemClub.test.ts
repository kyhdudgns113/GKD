import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {
  BlockedTrying,
  ChangeOneToOne,
  TryMineToOther,
  TryOtherToMine,
  TryOtherToOther
} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class ChangeMemClub extends GKDTestBase {
  private blockedTryToChange: BlockedTrying
  private changeOneToOne: ChangeOneToOne
  private tryMineToOther: TryMineToOther
  private tryOtherToMine: TryOtherToMine
  private tryOtherToOther: TryOtherToOther

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.blockedTryToChange = new BlockedTrying(REQUIRED_LOG_LEVEL + 1)
    this.changeOneToOne = new ChangeOneToOne(REQUIRED_LOG_LEVEL + 1)
    this.tryMineToOther = new TryMineToOther(REQUIRED_LOG_LEVEL + 1)
    this.tryOtherToMine = new TryOtherToMine(REQUIRED_LOG_LEVEL + 1)
    this.tryOtherToOther = new TryOtherToOther(REQUIRED_LOG_LEVEL + 1)
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
      await this.blockedTryToChange.testFail(db, logLevel)
      await this.changeOneToOne.testOK(db, logLevel)
      await this.tryMineToOther.testFail(db, logLevel)
      await this.tryOtherToMine.testFail(db, logLevel)
      await this.tryOtherToOther.testFail(db, logLevel)
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
  const testModule = new ChangeMemClub(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
