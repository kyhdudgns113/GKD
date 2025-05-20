import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {
  AddNextWeekDataType,
  DeleteWeekRowDataType,
  JwtPayloadType
} from '../../../../../../src/common/types'
import {Types} from 'mongoose'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class TryToOtherClub extends GKDTestBase {
  private portService = new ClientPortServiceTest().clientPortService

  private weekOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {club} = this.testDB.readClub(0, 0)
      const {clubOId} = club

      // 테스트 데이터 생성은 해야지...
      const {user} = this.testDB.readUser(0, 2)
      const jwtPayload: JwtPayloadType = user
      const data: AddNextWeekDataType = {clubOId}
      await this.portService.addNextWeek(jwtPayload, data)
      await this.portService.addPrevWeek(jwtPayload, data)
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, data)

      this.weekOId = weekRowsArr[0].weekOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {club} = this.testDB.readClub(0, 0)
      const {user} = this.testDB.readUser(1, 2)
      const {clubOId} = club
      const weekOId = this.weekOId
      const jwtPayload: JwtPayloadType = user
      const data: DeleteWeekRowDataType = {clubOId, weekOId}
      await this.portService.deleteWeekRow(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId} = this.testDB.readClub(0, 0).club

      const condQuery = {_id: new Types.ObjectId(clubOId)}
      const execQuery = {$set: {weekRowsArr: [], lastAddPrevWeekDate: 0, numOfAddedPrevWeek: 0}}

      await this.db.collection('weeklyrecords').deleteMany({clubOId})
      await this.db.collection('clubs').updateOne(condQuery, execQuery)
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
