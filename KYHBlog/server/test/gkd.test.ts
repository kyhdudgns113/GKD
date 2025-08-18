import * as mysql from 'mysql2/promise'
import minimist from 'minimist'
import {exit} from 'process'

import {GKDTestBase} from '@testCommons'

const DEFAULT_REQUIRED_LOG_LEVEL = 0

export class GKDBlogTest extends GKDTestBase {
  protected db: mysql.Connection

  constructor(protected readonly REQUIRED_LOG_LEVEL: number = 0) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Connection, logLevel: number) {}
  protected async execTest(db: mysql.Connection, logLevel: number) {
    try {
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
  protected async finishTest(db: mysql.Connection, logLevel: number) {}
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL

  const testModule = new GKDBlogTest(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
