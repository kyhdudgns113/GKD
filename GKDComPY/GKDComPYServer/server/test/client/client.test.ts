import mongoose from 'mongoose'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../_common'
import {ClientChat} from './client.chat'
import {ClientClub} from './client.club'
import {ClientRecord} from './client.record'

const DEFAULT_REQUIRED_LOG_LEVEL = 1

export class ClientTest extends GKDTestBase {
  private chatTest: ClientChat
  private clubTest: ClientClub
  private recordTest: ClientRecord

  constructor(REQUIRED_LOG_LEVEL: number = 1) {
    super(REQUIRED_LOG_LEVEL)
    this.chatTest = new ClientChat(REQUIRED_LOG_LEVEL + 1)
    this.clubTest = new ClientClub(REQUIRED_LOG_LEVEL + 1)
    this.recordTest = new ClientRecord(REQUIRED_LOG_LEVEL + 1)
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
  protected async execTest(db: mongoose.mongo.Db, logLevel: number) {
    try {
      await this.chatTest.testOK(db, logLevel)
      // this.logMessage('chatTest 는 주석처리 되었어요.')
      await this.clubTest.testOK(db, logLevel)
      // this.logMessage('clubTest 는 주석처리 되었어요.')
      // await this.recordTest.testOK(db, logLevel)
      this.logMessage('recordTest 는 주석처리 되었어요.')
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
  const testModule = new ClientTest(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
