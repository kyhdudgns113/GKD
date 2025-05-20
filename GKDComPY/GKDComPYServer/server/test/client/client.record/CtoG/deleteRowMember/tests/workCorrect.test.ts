import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {
  AddRowMemberDataType,
  DeleteRowMemDataType,
  JwtPayloadType,
  RecordMemberInfoType,
  SetDailyRecordType
} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class WorkCorrect extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private jwtPayload: JwtPayloadType
  private name: string
  private weekOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 1).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name

      const clubRes = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubRes.insertedId.toString()

      const membersInfo: RecordMemberInfoType[] = [
        {
          memOId: null,
          name,
          position: 0,
          batterPower: 9999,
          pitcherPower: 9999
        }
      ]
      const weekRes = await this.db
        .collection('weeklyrecords')
        .insertOne({clubOId, start: 101, end: 107, rowInfo: {clubOId, membersInfo}})
      const weekOId = weekRes.insertedId.toString()

      this.clubOId = clubOId
      this.jwtPayload = jwtPayload
      this.name = name
      this.weekOId = weekOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      // 이거 알파벳순으로 하면 안된다...
      // before 에서 하나 만들고 onlyOne 에서 하나 지워야 한다.
      // 그래야 fromMany 가 정상작동함
      await this.memberOK(this._deleteOnlyOne.bind(this), db, logLevel)
      await this.memberOK(this._deleteFromMany.bind(this), db, logLevel)
      await this.memberOK(this._deleteSyncMany.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, name} = this

      await this.db.collection('dailyrecords').deleteMany({clubOId})
      await this.db.collection('weeklyrecords').deleteMany({clubOId})
      await this.db.collection('clubs').deleteOne({name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _deleteOnlyOne(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload, name, weekOId} = this

      const date = 102
      const dataSubmit: SetDailyRecordType = {
        clubOId,
        start: 101,
        end: 107,
        date,
        name,
        condError: 0,
        results: [0, 0, 0],
        comment: '',
        memOId: ''
      }
      await this.portService.submitRecord(jwtPayload, dataSubmit)

      // 삭제
      const data: DeleteRowMemDataType = {weekOId, name}
      const {weeklyRecord} = await this.portService.deleteRowMember(jwtPayload, data)
      if (weeklyRecord.rowInfo.membersInfo.length > 0) throw `멤버가 안 지워졌니?`

      const dailyDB = await this.db.collection('dailyrecords').findOne({clubOId, name})
      if (dailyDB) throw `기록이 안 지워졌어요 ㅠㅠ`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _deleteFromMany(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload, weekOId} = this

      // 0 번 멤버와 그의 기록을 1개 만든다.
      const name0 = `testMem${this.constructor.name}0`
      const data0: AddRowMemberDataType = {
        weekOId,
        position: 0,
        name: name0,
        batterPower: 0,
        pitcherPower: 0
      }
      await this.portService.addRowMember(jwtPayload, data0)

      const data00: SetDailyRecordType = {
        clubOId,
        start: 101,
        end: 107,
        date: 102,
        name: name0,
        condError: 0,
        results: [0, 0, 0],
        comment: '',
        memOId: ''
      }
      await this.portService.submitRecord(jwtPayload, data00)

      // 1 번 멤버와 그의 기록을 1개 만든다.
      const name1 = `testMem${this.constructor.name}1`
      const data1: AddRowMemberDataType = {
        weekOId,
        position: 0,
        name: name1,
        batterPower: 0,
        pitcherPower: 0
      }
      await this.portService.addRowMember(jwtPayload, data1)

      const data11: SetDailyRecordType = {
        clubOId,
        start: 101,
        end: 107,
        date: 102,
        name: name1,
        condError: 0,
        results: [0, 0, 0],
        comment: '',
        memOId: ''
      }
      await this.portService.submitRecord(jwtPayload, data11)

      const data: DeleteRowMemDataType = {weekOId, name: name0}
      const {weeklyRecord} = await this.portService.deleteRowMember(jwtPayload, data)

      const numMems = weeklyRecord.rowInfo.membersInfo.length
      if (numMems > 1) throw `멤버가 안 지워졌니? ${numMems}`

      const dailyDB0 = await this.db.collection('dailyrecords').findOne({clubOId, name: name0})
      if (dailyDB0) throw `기록이 안 지워졌어요 ㅠㅠ`

      const dailyDB1 = await this.db.collection('dailyrecords').findOne({clubOId, name: name1})
      if (!dailyDB1) throw `다른 멤버 기록이 지워졌어요 ㅠㅠ`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _deleteSyncMany(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload, weekOId} = this

      const date = 102
      const recordsArr = [
        {result: 0, useClientLineUp: false},
        {result: 0, useClientLineUp: false},
        {result: 0, useClientLineUp: false}
      ]
      const queries = Array(10)
        .fill(null)
        .map((_, idx) => {
          return {
            clubOId,
            name: `testMemsa${this.constructor.name}${idx}`,
            date,
            recordsArr
          }
        })
      await this.db.collection('dailyrecords').insertMany(queries)

      await Promise.all([
        this.portService.deleteRowMember(jwtPayload, {
          weekOId,
          name: `testMemsa${this.constructor.name}0`
        }),
        this.portService.deleteRowMember(jwtPayload, {
          weekOId,
          name: `testMemsa${this.constructor.name}1`
        }),
        this.portService.deleteRowMember(jwtPayload, {
          weekOId,
          name: `testMemsa${this.constructor.name}2`
        }),
        this.portService.deleteRowMember(jwtPayload, {
          weekOId,
          name: `testMemsa${this.constructor.name}3`
        }),
        this.portService.deleteRowMember(jwtPayload, {
          weekOId,
          name: `testMemsa${this.constructor.name}4`
        })
      ])
      const {weeklyRecord} = await this.portService.deleteRowMember(jwtPayload, {
        weekOId,
        name: `testMemsa${this.constructor.name}5`
      })

      if (weeklyRecord.rowInfo.membersInfo.length > 4) throw `멤버가 안 지워졌니?`

      const dailyDB0 = await this.db
        .collection('dailyrecords')
        .findOne({clubOId, name: `testMemsa${this.constructor.name}5`})
      if (dailyDB0) throw `기록이 안 지워졌어요 ㅠㅠ`

      const dailyDB1 = await this.db
        .collection('dailyrecords')
        .findOne({clubOId, name: `testMemsa${this.constructor.name}6`})
      if (!dailyDB1) throw `다른 멤버 기록이 지워졌어요 ㅠㅠ`
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
  const testModule = new WorkCorrect(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
