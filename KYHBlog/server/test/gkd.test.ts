import * as mysql from 'mysql2/promise'
import minimist from 'minimist'
import {exit} from 'process'

import {GKDTestBase} from '@testCommons'
import {ClientModule} from './client'

const DEFAULT_REQUIRED_LOG_LEVEL = 0

export class GKDBlogTest extends GKDTestBase {
  protected db: mysql.Pool

  private readonly clientModule: ClientModule

  constructor(protected readonly REQUIRED_LOG_LEVEL: number = 0) {
    super(REQUIRED_LOG_LEVEL)

    this.clientModule = new ClientModule(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {}
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.clientModule.testOK(db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      console.log(errObj)
      throw errObj
      // ::
    } finally {
      // ::
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {}
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL

  const testModule = new GKDBlogTest(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
