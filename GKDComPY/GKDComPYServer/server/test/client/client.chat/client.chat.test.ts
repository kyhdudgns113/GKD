import mongoose from 'mongoose'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../_common'
import {GetChatsArr} from './getChatsArr'

const DEFAULT_REQUIRED_LOG_LEVEL = 2

export class ClientChat extends GKDTestBase {
  private testGetChatsArr: GetChatsArr

  constructor(REQUIRED_LOG_LEVEL: number = 2) {
    super(REQUIRED_LOG_LEVEL)

    this.testGetChatsArr = new GetChatsArr(REQUIRED_LOG_LEVEL + 1)
  }

  protected db: mongoose.mongo.Db | null
  protected logLevel: number

  protected async beforeTest(db: mongoose.mongo.Db, logLevel: number) {
    try {
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: mongoose.mongo.Db, logLevel: number): Promise<void> {
    try {
      await this.testGetChatsArr.testOK(db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: mongoose.mongo.Db, logLevel: number) {
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
  const testModule = new ClientChat(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
