import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {
  AddNextWeekDataType,
  AddPrevWeekDataType,
  AddRowMemberDataType,
  JwtPayloadType,
  WeekRowsType
} from '../../../../../../src/common/types'
import {shiftDateValue} from '../../../../../../src/common/utils'
import {Types} from 'mongoose'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class AddOne extends GKDTestBase {
  private portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private name: string
  private weekRowsArr: WeekRowsType[]

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {clubOId} = this.testDB.readClub(0, 0).club
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name

      // 초기 weekRow 뙇!!
      const addNewWeekData: AddNextWeekDataType = {clubOId}
      const {weekRowsArr: _arr} = await this.portService.addNextWeek(jwtPayload, addNewWeekData)

      // 초기 row member 뙇!!
      for (let i = 0; i < 10; i++) {
        const addRowMemData: AddRowMemberDataType = {
          weekOId: _arr[0].weekOId,
          position: 0,
          name: name + i,
          batterPower: 0,
          pitcherPower: 0
        }
        await this.portService.addRowMember(jwtPayload, addRowMemData)
      }

      // weekRowsArr 뙇!! addPrevWeek 를 여기서 부른다.
      const data: AddPrevWeekDataType = {clubOId}
      const {weekRowsArr} = await this.portService.addPrevWeek(jwtPayload, data)

      this.clubOId = clubOId
      this.name = name
      this.weekRowsArr = weekRowsArr
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._testAdded.bind(this), db, logLevel)
      await this.memberOK(this._testStartEnd.bind(this), db, logLevel)
      await this.memberOK(this._testSameMembers.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, name} = this
      await this.db.collection('weeklyrecords').deleteMany({clubOId})

      const condQuery = {_id: new Types.ObjectId(clubOId)}
      const clubQuery = {$unset: {weekRowsArr: []}}
      await this.db.collection('clubs').updateOne(condQuery, clubQuery)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _testAdded(db: Db, logLevel: number) {
    try {
      const {weekRowsArr} = this

      if (weekRowsArr.length < 2) throw `아직 함수가 구현이 안된것 같아요`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _testStartEnd(db: Db, logLevel: number) {
    try {
      const {weekRowsArr} = this

      const prevWeek = weekRowsArr[0]
      const nowWeek = weekRowsArr[1]

      if (shiftDateValue(prevWeek.start, 7) !== nowWeek.start) throw '시작일이 잘못 생성되었습니다.'
      if (shiftDateValue(prevWeek.end, 7) !== nowWeek.end) throw '말일이 잘못 생성되었습니다.'
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _testSameMembers(db: Db, logLevel: number) {
    try {
      const {weekRowsArr} = this

      const prevWeek = weekRowsArr[0]
      const nowWeek = weekRowsArr[1]

      const queryPrev = {_id: new Types.ObjectId(prevWeek.weekOId)}
      const queryNow = {_id: new Types.ObjectId(nowWeek.weekOId)}

      const prevWeekly = await db.collection('weeklyrecords').findOne(queryPrev)
      const nowWeekly = await db.collection('weeklyrecords').findOne(queryNow)

      const prevRowMemInfo = prevWeekly.rowInfo.membersInfo
      const nowRowMemInfo = nowWeekly.rowInfo.membersInfo

      if (prevRowMemInfo.length !== nowRowMemInfo.length) throw `왜 rowMem 배열의 길이가 다를까`

      for (let i = 0; i < prevRowMemInfo.length; i++) {
        if (prevRowMemInfo[i].name.localeCompare(nowRowMemInfo[i].name) !== 0)
          throw `왜 멤버 이름이 다르지`
      }
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
  const testModule = new AddOne(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
