import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {
  AddNextWeekDataType,
  DeleteWeekRowDataType,
  JwtPayloadType,
  WeekRowsType
} from '../../../../../../src/common/types'
import {Types} from 'mongoose'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class SingleDone extends GKDTestBase {
  private portService = new ClientPortServiceTest().clientPortService

  private weekRowsArr: WeekRowsType[]
  private weekOId: string
  private start: number
  private end: number

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
      await this.portService.addPrevWeek(jwtPayload, data)
      await this.portService.addPrevWeek(jwtPayload, data)
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, data)

      this.weekOId = weekRowsArr[0].weekOId
      this.start = weekRowsArr[0].start
      this.end = weekRowsArr[0].end
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      // Prepare Area
      const {club} = this.testDB.readClub(0, 0)
      const {user} = this.testDB.readUser(0, 2)
      const {clubOId} = club
      const weekOId = this.weekOId
      const jwtPayload: JwtPayloadType = user
      const data: DeleteWeekRowDataType = {clubOId, weekOId}
      const {weekRowsArr} = await this.portService.deleteWeekRow(jwtPayload, data)
      this.weekRowsArr = weekRowsArr

      // Test Area
      await this._returnArrTest(db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId} = this.testDB.readClub(0, 0).club
      await this.db.collection('weeklyrecords').deleteMany({clubOId})
      await this.db
        .collection('clubs')
        .updateOne(
          {_id: new Types.ObjectId(clubOId)},
          {$set: {weekRowsArr: [], lastAddPrevWeekDate: 0, numOfAddedPrevWeek: 0}}
        )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _returnArrTest(db: Db, logLevel: number) {
    try {
      const weekRowsArr = this.weekRowsArr
      const clubOId = this.testDB.readClub(0, 0).club.clubOId

      // 1개 삭제되서 4개 남았는지 췍!!
      if (weekRowsArr.length !== 4)
        throw `${this.constructor.name}: 길이가 왜 4가 아니라 ${weekRowsArr.length}?`

      // 실제로 삭제가 되긴 했는지 췍!!
      const res1 = await this.db
        .collection('weeklyrecords')
        .findOne({_id: new Types.ObjectId(this.weekOId)})
      if (res1) throw `${this.constructor.name}: 주간 기록이 삭제가 안됨`

      // 배열 제대로 리턴하는지 췍!!
      if (weekRowsArr.filter(val => val.weekOId === this.weekOId).length > 0)
        throw `${this.constructor.name}: 리턴 배열이 이상함`

      // 개별 기록도 삭제가 됬는지 췍!!
      const start = this.start
      const end = this.end
      const dailyRecords = await this.db
        .collection('dailyrecords')
        .find({clubOId, start: {$gte: start}, end: {$lte: end}})
      if ((await dailyRecords.toArray()).length > 0)
        throw `${this.constructor.name}: 개별 기록 삭제가 안됬엉`
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
  const testModule = new SingleDone(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
