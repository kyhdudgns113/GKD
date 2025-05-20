import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {
  AddNextWeekDataType,
  JwtPayloadType,
  WeeklyRecordType
} from '../../../../../../src/common/types'
import {Types} from 'mongoose'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class AddMultipleWeek extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private name: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name

      const clubDB = await this.db.collection('clubs').insertOne({name, commOId})
      const clubOId = clubDB.insertedId.toString()

      const queries = Array(30)
        .fill(null)
        .map((_, idx) => {
          // MemberInfoType 을 넣으면 불필요하게 복잡해진다.
          return {
            name: name + idx,
            commOId,
            clubOId,
            batterPower: 10000 - idx,
            pitcherPower: 10000 - idx
          }
        })
      await this.db.collection('members').insertMany(queries)

      this.clubOId = clubOId
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.name = name
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._createFirst.bind(this), db, logLevel)
      await this.memberOK(this._createSecond.bind(this), db, logLevel)
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
      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('clubs').deleteOne({name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _createFirst(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload, name} = this

      const data: AddNextWeekDataType = {clubOId}

      // 주차를 추가하고 그 결과를 불러온다.
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, data)

      // 0주차의 기록을 확인한다.
      const {weekOId} = weekRowsArr[0]
      const query = {_id: new Types.ObjectId(weekOId)}
      const weekDB = await this.db.collection('weeklyrecords').findOne(query)
      const weeklyRecord: WeeklyRecordType = {
        weekOId,
        clubOId,
        start: weekDB.start,
        end: weekDB.end,
        title: weekDB.title,
        comment: weekDB.comment,
        rowInfo: weekDB.rowInfo,
        colInfo: weekDB.colInfo
      }

      // 0주차의 모든 멤버의 기록을 확인한다.
      const {membersInfo} = weeklyRecord.rowInfo
      for (let i = 0; i < 30; i++) {
        if (membersInfo[i].name !== `${name}${i}`) throw `=${name}= 멤버 로딩이 잘못됬어요.`
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _createSecond(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, jwtPayload, name} = this
      let i = 0
      await this.db.collection('members').insertOne({
        name: name + 30,
        commOId,
        clubOId,
        batterPower: 10000 - 30,
        pitcherPower: 10000 - 30
      })

      const data: AddNextWeekDataType = {clubOId}
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, data)
      const {weekOId} = weekRowsArr[1]
      const query = {_id: new Types.ObjectId(weekOId)}
      const weekDB = await this.db.collection('weeklyrecords').findOne(query)
      const weeklyRecord: WeeklyRecordType = {
        weekOId,
        clubOId,
        start: weekDB.start,
        end: weekDB.end,
        title: weekDB.title,
        comment: weekDB.comment,
        rowInfo: weekDB.rowInfo,
        colInfo: weekDB.colInfo
      }

      const {membersInfo} = weeklyRecord.rowInfo
      try {
        for (i = 0; i < 31; i++) {
          if (membersInfo[i].name !== name + i) throw `${name} ${i} 멤버 로딩이 잘못됬어요.`
        }
        // BLANK LINE COMMENT:
      } catch (errObj) {
        // BLANK LINE COMMENT:
        throw `${name} ${i} 멤버 로딩이 잘못됬어요.`
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
  const testModule = new AddMultipleWeek(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
