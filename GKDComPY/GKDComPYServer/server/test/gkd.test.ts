import mongoose from 'mongoose'
import minimist from 'minimist'
import {exit} from 'process'

import {ClientTest} from './client/client.test'
import {GKDTestBase} from './_common'

const DEFAULT_REQUIRED_LOG_LEVEL = 0

export class GKDComPYTest extends GKDTestBase {
  private readonly clientTest: ClientTest
  protected db: mongoose.mongo.Db

  constructor(protected readonly REQUIRED_LOG_LEVEL: number = 0) {
    super(REQUIRED_LOG_LEVEL)

    this.clientTest = new ClientTest(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mongoose.mongo.Db, logLevel: number) {}
  protected async execTest(db: mongoose.mongo.Db, logLevel: number) {
    try {
      await this.clientTest.testOK(db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      console.log(errObj)
      throw errObj
      // BLANK LINE COMMENT:
    } finally {
      // BLANK LINE COMMENT:
    }
  }
  protected async finishTest(db: mongoose.mongo.Db, logLevel: number) {}
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL

  const testModule = new GKDComPYTest(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
