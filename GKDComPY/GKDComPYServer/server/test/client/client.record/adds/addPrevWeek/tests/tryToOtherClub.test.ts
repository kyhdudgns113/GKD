import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {AddPrevWeekDataType, JwtPayloadType} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class TryToOtherClub extends GKDTestBase {
  private portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private jwtPayload: JwtPayloadType

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {clubOId} = this.testDB.readClub(0, 0).club
      const {id, uOId} = this.testDB.readUser(1, 2).user

      const jwtPayload: JwtPayloadType = {id, uOId}

      this.clubOId = clubOId
      this.jwtPayload = jwtPayload
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload} = this

      const data: AddPrevWeekDataType = {clubOId}
      await this.portService.addPrevWeek(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId} = this

      await this.db.collection('weeklyrecords').deleteMany({clubOId})
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
  const testModule = new TryToOtherClub(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
