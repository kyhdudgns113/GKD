import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {Types} from 'mongoose'
import {
  AddMemberDataType,
  AddNextWeekDataType,
  AddPrevWeekDataType,
  JwtPayloadType,
  MemberInfoType,
  SetDailyRecordType,
  WeekRowsType
} from '../../../../../../src/common/types'
import {shiftDateValue} from '../../../../../../src/common/utils'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class WorkCorrect extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private membersArr: MemberInfoType[]
  private name: string // 클럽의 이름이다.
  private weekRowsArr: WeekRowsType[]
  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      // 변수 준비
      const {commOId} = this.testDB.readComm(0).comm
      const {uOId, id} = this.testDB.readUser(0, 2).user

      const name = this.constructor.name
      const jwtPayload: JwtPayloadType = {uOId, id}

      const clubRes = await this.db.collection('clubs').insertOne({name, commOId})
      const clubOId = clubRes.insertedId.toString()

      const dataNext: AddNextWeekDataType = {clubOId}
      const dataPrev: AddPrevWeekDataType = {clubOId}

      // 클럽 임시 멤버 5명을 DB에 만든다.
      for (let i = 0; i < 5; i++) {
        const dataAddMem: AddMemberDataType = {
          name: name + i,
          commOId,
          clubOId,
          batterPower: 0,
          pitcherPower: 0
        }
        await this.portService.addMemberReqByClub(jwtPayload, dataAddMem)
      }

      // 클럽 임시 멤버 정보를 배열로 만든다.
      const {members} = await this.portService.getMembersByClub(jwtPayload, clubOId)
      const membersArr: MemberInfoType[] = []
      for (let i = 0; i < 5; i++) {
        Object.keys(members).forEach((memOId, keyIdx) => {
          if (members[memOId].name === name + i) membersArr.push(members[memOId])
        })
      }

      // 주차를 4개 만든다.
      await this.portService.addNextWeek(jwtPayload, dataNext)
      await this.portService.addPrevWeek(jwtPayload, dataPrev)
      await this.portService.addPrevWeek(jwtPayload, dataPrev)
      const {weekRowsArr} = await this.portService.addPrevWeek(jwtPayload, dataPrev)

      if (weekRowsArr.length !== 4) throw `${this.constructor.name} 주차 배열 크기가 왜 4가 아냐?`

      // 주차별, 날짜별, 멤버별 기록을 만든다.
      for (let weekIdx = 0; weekIdx < weekRowsArr.length; weekIdx++) {
        const weekRow = weekRowsArr[weekIdx]
        const {start, end} = weekRow

        // 월~토 까지만 대전기록이 존재한다.
        for (let shift = 0; shift <= 5; shift++) {
          const date = shiftDateValue(start, shift)
          for (let memIdx = 0; memIdx < membersArr.length; memIdx++) {
            const member = membersArr[memIdx]
            const newName = `${member.name}_${date}`
            const dataRecord: SetDailyRecordType = {
              clubOId,
              start,
              end,
              date,
              name: newName,
              condError: 0,
              results: [1, 1, 1],
              comment: `${member.name} ${date}`, // 코멘트 내용으로 타당성을 체크한다.
              memOId: member.memOId
            }
            await this.portService.submitRecord(jwtPayload, dataRecord)
          }
        }
      }

      this.clubOId = clubOId
      this.jwtPayload = jwtPayload
      this.membersArr = membersArr
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
      await this.memberOK(this._test_1_readNowWeek.bind(this), db, logLevel)
      await this.memberOK(this._test_2_read4Week.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, name} = this

      await this.db.collection('clubs').deleteOne({commOId, name})
      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('weeklyrecords').deleteMany({clubOId})
      await this.db.collection('dailyrecords').deleteMany({clubOId})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * 현재 주차의 대전기록을 잘 읽어오는지 확인
   */
  private async _test_1_readNowWeek(db: Db, logLevel: number) {
    try {
      const {jwtPayload, membersArr, name: _name, weekRowsArr} = this
      const member = membersArr[0]
      const {memOId} = member

      const {dailyRecordsArr, end} = await this.portService.getMemberRecordsArr(
        jwtPayload,
        memOId,
        0
      )
      if (dailyRecordsArr.length !== 6)
        throw `${_name} 기록이 6개가 아냐? ${dailyRecordsArr.length}`

      let shift = 0

      // 1주간 기록들의 코멘트, 날짜를 점검한다.
      dailyRecordsArr.map((dailyRecord, rIdx) => {
        const {comment} = dailyRecord
        const [name, date] = comment.split(' ')

        if (`${name}_${date}` !== dailyRecord.name) throw `${_name} 왜 이름이 다르냐`

        const shiftValue = shiftDateValue(weekRowsArr[3].start, shift)
        if (date !== shiftValue.toString()) throw `${_name} 왜 날짜가 다르냐 ${date}vs${shiftValue}`

        shift += 1
      })
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 4주간의 대전기록을 잘 읽어오는지 확인
   */
  private async _test_2_read4Week(db: Db, logLevel: number) {
    try {
      const {jwtPayload, membersArr, name: _name, weekRowsArr} = this

      const member = membersArr[0]
      const {memOId} = member

      // 현재주를 포함하기 때문에 21로 설정하는게 맞다.
      const {dailyRecordsArr, end} = await this.portService.getMemberRecordsArr(
        jwtPayload,
        memOId,
        21
      )
      const resLen = dailyRecordsArr.length
      if (resLen !== 24) throw `${_name}_mul 기록이 24개가 아냐? ${resLen}`

      // 4주간 기록들의 코멘트, 날짜를 점검한다.
      let recordIdx = 0
      weekRowsArr.map((weekRow, weekIdx) => {
        for (let shift = 0; shift <= 5; shift++) {
          const dailyRecord = dailyRecordsArr[recordIdx]
          const {comment} = dailyRecord
          const [name, date] = comment.split(' ')

          if (`${name}_${date}` !== dailyRecord.name) throw `${_name}_mul 왜 이름이 다르냐`

          const shifted = shiftDateValue(weekRow.start, shift)
          if (date !== shifted.toString()) throw `${_name}_mul 왜 날짜가 다르냐 ${date}vs${shifted}`
          recordIdx += 1
        }
      })
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
