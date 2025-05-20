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
  SetCommentDataType,
  SetDailyRecordType,
  SetTHeadDataType,
  WeekRowsType
} from '../../../../../../src/common/types'
import {shiftDateValue} from '../../../../../../src/common/utils'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class WorkCorrect extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private commOId: string
  private clubOId: string
  private jwtPayload: JwtPayloadType
  private membersArr: MemberInfoType[]
  private weekRowsArr: WeekRowsType[]

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      // 변수 준비
      const {commOId} = this.testDB.readComm(0).comm
      this.commOId = commOId
      const clubRes = await this.db
        .collection('clubs')
        .insertOne({name: this.constructor.name, commOId: this.commOId})
      const clubOId = clubRes.insertedId.toString()
      this.clubOId = clubOId

      const {user} = this.testDB.readUser(0, 2)
      const {uOId, id} = user
      const jwtPayload: JwtPayloadType = {uOId, id}
      this.jwtPayload = jwtPayload
      const dataNext: AddNextWeekDataType = {clubOId}
      const dataPrev: AddPrevWeekDataType = {clubOId}

      // 클럽 임시 멤버 5명을 DB에 만든다.
      for (let i = 0; i < 5; i++) {
        const dataAddMem: AddMemberDataType = {
          name: `testMember${i}`,
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
        const name = `testMember${i}`
        Object.keys(members).forEach((memOId, keyIdx) => {
          if (members[memOId].name === name) membersArr.push(members[memOId])
        })
      }
      this.membersArr = membersArr

      // 주차를 2개 만든다.
      await this.portService.addNextWeek(jwtPayload, dataNext)
      const {weekRowsArr} = await this.portService.addPrevWeek(jwtPayload, dataPrev)
      this.weekRowsArr = weekRowsArr

      if (weekRowsArr.length !== 2) throw `${this.constructor.name} 주차 배열 크기가 왜 2가 아냐?`

      // 주차별, 날짜별, 멤버별 기록을 만든다.
      for (let weekIdx = 0; weekIdx < weekRowsArr.length; weekIdx++) {
        const weekRow = weekRowsArr[weekIdx]
        const {start, end, weekOId} = weekRow

        // 주차별 일간 정보를 저장한다.
        for (let dateIdx = 0; dateIdx <= 5; dateIdx++) {
          const date = shiftDateValue(start, dateIdx)
          const enemyName = `${date}상대`
          const pitchOrder = dateIdx % 5
          const order = date.toString()
          const dataHead: SetTHeadDataType = {
            clubOId,
            weekOId,
            dateIdx,
            enemyName,
            pitchOrder,
            order
          }
          await this.portService.setTHead(jwtPayload, dataHead)

          const comments = `${date}코멘트`
          const dataMent: SetCommentDataType = {weekOId, dayIdx: dateIdx, comments}
          await this.portService.setComments(jwtPayload, dataMent)
        }

        // 월~토 까지만 대전기록이 존재한다.
        for (let date = start; date <= shiftDateValue(start, 5); date++) {
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
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this._test_1_readRowInfo(db, logLevel)
      await this._test_2_readColInfo(db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId} = this
      await this.db.collection('clubs').deleteOne({_id: new Types.ObjectId(this.clubOId)})
      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('weeklyrecords').deleteMany({clubOId})
      await this.db.collection('dailyrecords').deleteMany({clubOId})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // TEST AREA:

  /**
   * 행 정보를 잘 읽어오나 테스트한다.
   */
  private async _test_1_readRowInfo(db: Db, logLevel: number) {
    try {
      const weekRow = this.weekRowsArr[0]
      const jwtPayload = this.jwtPayload
      const {weekOId} = weekRow

      const {weeklyRecord} = await this.portService.getWeeklyRecord(jwtPayload, weekOId)
      const {rowInfo} = weeklyRecord
      const {clubOId, membersInfo} = rowInfo

      // clubOId 제대로 들어갔나 확인
      if (clubOId !== this.clubOId) {
        this.logMessage(`clubOId 가 이상함. 원래:${this.clubOId}, 들어간것:${clubOId}`, 1)
        throw `${this.constructor.name}/_test_1_readRowInfo: 클럽 OId 가 이상함`
      }

      // 입력했던 멤버랑 갯수 맞는지 확인
      //   - 멤버정보에서 변경된 멤버에 대해서는 여기서 테스트하지 않는다.
      const baseLen = this.membersArr.length
      const resultLen = membersInfo.length
      if (baseLen !== resultLen) {
        this.logMessage(`멤버배열 크기가 다름. 원래:${baseLen}, 결과:${resultLen}`, 1)
        throw `${this.constructor.name}/_test_1_readRowInfo: 배열 크기가 이상함`
      }

      // 입력했던 멤버 있는지 확인
      for (let memIdx = 0; memIdx < baseLen; memIdx++) {
        const member = this.membersArr[memIdx]
        const result = membersInfo.findIndex(memInfo => memInfo.memOId === member.memOId)
        if (result === -1) {
          this.logMessage(`${member.name} 가 배열에 없음`, 1)
          throw `${this.constructor.name}/_test_1_readRowInfo: 멤버가 없음`
        }
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 열 정보를 잘 읽어오나 테스트한다.
   *   - 미구현된건 읽어오면 안된다.
   */
  private async _test_2_readColInfo(db: Db, logLevel: number) {
    try {
      const weekRow = this.weekRowsArr[0]
      const jwtPayload = this.jwtPayload
      const {weekOId} = weekRow

      const {weeklyRecord} = await this.portService.getWeeklyRecord(jwtPayload, weekOId)
      const {start} = weeklyRecord
      const {clubOId, dateInfo} = weeklyRecord.colInfo

      // 클럽 OId 확인
      if (clubOId !== this.clubOId) {
        this.logMessage(`clubOId 불일치. 원래:${this.clubOId}, 결과:${clubOId}`)
        throw `${this.constructor.name}/_test_2_readColInfo/clubOId 불일치`
      }

      // 일자별 정보 확인
      for (let dateIdx = 0; dateIdx < 6; dateIdx++) {
        const dayInfo = dateInfo[dateIdx]

        // 확인: clubOId
        if (dayInfo.clubOId !== this.clubOId) {
          this.logMessage(
            `${dateIdx}번쨰 clubOId 불일치. 원래:${this.clubOId}, 결과:${dayInfo.clubOId}`
          )
          throw `${this.constructor.name}/_test_2_readColInfo/${dateIdx}번째 clubOId 불일치`
        }

        // 확인: date
        const baseDate = shiftDateValue(start, dateIdx)
        if (dayInfo.date !== baseDate) {
          this.logMessage(`${dateIdx}번쨰 date 불일치. 원래:${baseDate}, 결과:${dayInfo.date}`)
          throw `${this.constructor.name}/_test_2_readColInfo/${dateIdx}번째 date 불일치`
        }

        // 확인: enemyName
        const baseEnemy = `${baseDate}상대`
        if (dayInfo.enemyName !== baseEnemy) {
          this.logMessage(
            `${dateIdx}번쨰 enemyName 불일치. 원래:${baseEnemy}, 결과:${dayInfo.enemyName}`
          )
          throw `${this.constructor.name}/_test_2_readColInfo/${dateIdx}번째 enemyName 불일치`
        }

        // 확인: pitchOrder
        const basePitch = dateIdx % 5
        if (dayInfo.pitchOrder !== basePitch) {
          this.logMessage(
            `${dateIdx}번쨰 pitchOrder 불일치. 원래:${basePitch}, 결과:${dayInfo.pitchOrder}`
          )
          throw `${this.constructor.name}/_test_2_readColInfo/${dateIdx}번째 pitchOrder 불일치`
        }

        // 확인: order
        const baseOrder = baseDate.toString()
        if (dayInfo.order !== baseOrder) {
          this.logMessage(`${dateIdx}번쨰 order 불일치. 원래:${baseOrder}, 결과:${dayInfo.order}`)
          throw `${this.constructor.name}/_test_2_readColInfo/${dateIdx}번째 order 불일치`
        }

        // 확인: result
        if (dayInfo.result) {
          this.logMessage(`${dateIdx}번쨰 나는 일일 결과를 입력한적이 없다.`)
          throw `${this.constructor.name}/_test_2_readColInfo/${dateIdx}번째 result 왜 있는거지`
        }

        // 확인: tropy
        if (dayInfo.tropy) {
          this.logMessage(`${dateIdx}번쨰 나는 tropy를 입력한적이 없다.`)
          throw `${this.constructor.name}/_test_2_readColInfo/${dateIdx}번째 tropy 왜 있는거지`
        }

        // 확인: points
        if (dayInfo.points) {
          this.logMessage(`${dateIdx}번쨰 나는 points 입력한적이 없다.`)
          throw `${this.constructor.name}/_test_2_readColInfo/${dateIdx}번째 points 왜 있는거지`
        }

        // 확인: comments
        const baseMent = `${baseDate}코멘트`
        if (dayInfo.comments !== baseMent) {
          this.logMessage(
            `${dateIdx}번쨰 comments 불일치. 원래:${baseMent}, 결과:${dayInfo.comments}`
          )
          throw `${this.constructor.name}/_test_2_readColInfo/${dateIdx}번째 comments 불일치`
        }
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
  const testModule = new WorkCorrect(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
