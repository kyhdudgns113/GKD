import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {Types} from 'mongoose'
import {
  AddNextWeekDataType,
  AddPrevWeekDataType,
  JwtPayloadType,
  WeekRowsType
} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class BlockedTrying extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private weekRowsArr: WeekRowsType[]

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    // getWeeklyRecord 는 authVal 이 0이어도 가능해야한다.
    try {
      const {commOId} = this.testDB.readComm(0).comm

      const clubRes = await this.db
        .collection('clubs')
        .insertOne({name: this.constructor.name, commOId})
      const clubOId = clubRes.insertedId.toString()
      this.clubOId = clubOId

      const {user} = this.testDB.readUser(0, 2)
      const {uOId, id} = user

      const jwtPayload: JwtPayloadType = {id, uOId}

      // 테스트용 주간을 2개 만든다.
      const dataNext: AddNextWeekDataType = {clubOId}
      const dataPrev: AddPrevWeekDataType = {clubOId}
      await this.portService.addNextWeek(jwtPayload, dataNext)
      const {weekRowsArr} = await this.portService.addPrevWeek(jwtPayload, dataPrev)
      this.weekRowsArr = weekRowsArr
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const weekRowsArr = this.weekRowsArr
      const {user} = this.testDB.readUser(0, 0)
      const {id, uOId} = user
      const jwtPayload: JwtPayloadType = {id, uOId}
      await this.portService.getWeeklyRecord(jwtPayload, weekRowsArr[0].weekOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const clubOId = this.clubOId
      await this.db.collection('clubs').deleteOne({_id: new Types.ObjectId(clubOId)})
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
  const testModule = new BlockedTrying(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
