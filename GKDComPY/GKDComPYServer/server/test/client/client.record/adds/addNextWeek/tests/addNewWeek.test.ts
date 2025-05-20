import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {AddNextWeekDataType, JwtPayloadType, WeekRowsType} from '../../../../../../src/common/types'
import {Types} from 'mongoose'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 주간 기록이 아예 없는 상황에서 addNextWeek 이 호출되었을때 제대로 돌아가나를 테스트한다. \
 * 검증해야 할 사항이 여러개라 멤버 변수를 추가하고 사용한다. \
 * 멤버 변수에 대한 검증을 하기 때문에 이를 테스트 하기 위한 클래스를 또 만들지는 않는다. \
 * 멤버 함수로 만든다.
 */
export class AddNewWeek extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  // beforeTest 에서 함수를 호출해놔서 jwtPayload 가 필요가 없어졌다.
  private clubOId: string
  private name: string
  private weekRowsArr: WeekRowsType[]

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name

      const resClub = await this.db.collection('clubs').insertOne({name, commOId})
      const clubOId = resClub.insertedId.toString()

      // 테스트 멤버를 생성한다.
      const queries = Array(30)
        .fill(null)
        .map((_, idx) => {
          return {name: name + idx, commOId, clubOId}
        })
      await this.db.collection('members').insertMany(queries)

      // AddNextWeek 을 실행한다.
      const data: AddNextWeekDataType = {clubOId}
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, data)

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
      await this.memberOK(this._testArrLength.bind(this), db, logLevel)
      await this.memberOK(this._testRecordCreated.bind(this), db, logLevel)
      await this.memberOK(this._testRecordRowMember.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, name} = this
      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('clubs').deleteOne({name})
      await this.db.collection('weeklyrecords').deleteMany({clubOId})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _testArrLength(db: Db, logLevel: number) {
    try {
      const {weekRowsArr} = this
      if (weekRowsArr.length === 0) throw '주간 기록이 0개가 왔다고???'
      if (weekRowsArr.length > 1) throw '주간 기록이 여러개가 생겼다고???'
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _testRecordCreated(db: Db, logLevel: number) {
    try {
      const {clubOId, weekRowsArr} = this
      const {weekOId, start, end, title} = weekRowsArr[0]

      const _id = new Types.ObjectId(weekOId)
      const weekRecordDB = await this.db.collection('weeklyrecords').findOne({_id})
      if (!weekRecordDB) throw `weeklyRecord 가 생성되지 않았습니다.`
      if (weekRecordDB.clubOId !== clubOId) throw `clubOId 가 다릅니다.`
      if (weekRecordDB.start !== start || weekRecordDB.end !== end) throw `날짜가 다릅니다`
      if (weekRecordDB.title !== title) throw `제목이 다릅니다`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 주차를 추가했을때, 클럽 멤버 목록에 있는 멤버만 추가되었나 테스트
   */
  private async _testRecordRowMember(db: Db, logLevel: number) {
    try {
      const {clubOId, weekRowsArr} = this

      const {weekOId} = weekRowsArr[0]
      const query = {_id: new Types.ObjectId(weekOId)}
      const weeklyRecordDB = await this.db.collection('weeklyrecords').findOne(query)

      const {membersInfo} = weeklyRecordDB.rowInfo
      const dummy: {[name: string]: string} = {}
      for (let memInfo of membersInfo) {
        dummy[memInfo.name] = memInfo.name
      }
      if (Object.keys(dummy).length !== 30) throw `weeklyRecord 에 멤버가 덜 들어감.`

      const membersArrDB = await this.db.collection('members').find({clubOId}).toArray()
      for (let member of membersArrDB) {
        delete dummy[member.name]
      }

      if (Object.keys(dummy).length !== 0) throw `weeklyRecord 에 멤버가 이상한게 들어감`
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
  const testModule = new AddNewWeek(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
