/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortService} from '../../../../../../src/modules/database/ports/clientPort/clientPort.service'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {
  AddNextWeekDataType,
  AddPrevWeekDataType,
  JwtPayloadType,
  SetCommentDataType,
  WeeklyRecordType,
  WeekRowsType
} from 'src/common/types'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 3개 주차를 만들고 테스트한다.
 *   - 이전주차, 현재주차, 다음주차
 *   - 다다음주차 만드려니 너무 먼 미래라는 에러뜬다.
 */
export class WorkCorrect extends GKDTestBase {
  private portService: ClientPortService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commentsArr: string[][]
  private commOId: string
  private jwtPayload: JwtPayloadType
  private name: string
  private weekRowsArr: WeekRowsType[]

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const name = this.constructor.name
      const jwtPayload: JwtPayloadType = {id, uOId}

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

      const data: AddNextWeekDataType = {clubOId}
      const dataPrev: AddPrevWeekDataType = {clubOId}
      await this.portService.addNextWeek(jwtPayload, data)
      await this.portService.addPrevWeek(jwtPayload, dataPrev)
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, data)

      const commentsArr = Array.from({length: 6}, () => Array(6).fill(''))

      this.clubOId = clubOId
      this.commentsArr = commentsArr
      this.commOId = commOId
      this.jwtPayload = jwtPayload
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
      await this.memberOK(this._SetWeek0.bind(this), db, logLevel)
      await this.memberOK(this._SetWeek1.bind(this), db, logLevel)
      await this.memberOK(this._SetWeek2.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, name} = this
      await this.db.collection('weeklyrecords').deleteMany({clubOId})
      await this.db.collection('clubs').deleteOne({commOId, name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _SetWeek0(db: Db, logLevel: number) {
    try {
      const {commentsArr, jwtPayload, name, weekRowsArr} = this
      const weekIdx = 0
      const {weekOId} = weekRowsArr[weekIdx]

      // 이 주차의 각 입력마다 모든 일자의 데이터가 제대로 되어있는가가
      for (let dayIdx = 0; dayIdx < 6; dayIdx++) {
        const comments = name + dayIdx
        commentsArr[weekIdx][dayIdx] = comments

        const data: SetCommentDataType = {comments, dayIdx, weekOId}
        const {weeklyRecord} = await this.portService.setComments(jwtPayload, data)

        for (let checkIdx = 0; checkIdx < 6; checkIdx++) {
          const _prev = commentsArr[weekIdx][checkIdx]
          const _next = weeklyRecord.colInfo.dateInfo[checkIdx].comments

          if (_prev !== _next) throw `${weekIdx} 주차의 ${checkIdx} 일자의 코멘트 에러`
        }
      }

      // 다른 주차의 데이터가 바뀌진 않았나 체크
      for (let wIdx = 0; wIdx < 3; wIdx++) {
        // 중복 체크는 피하자.
        if (wIdx === weekIdx) continue

        const {weekOId} = weekRowsArr[wIdx]
        const {weeklyRecord} = await this.portService.getWeeklyRecord(jwtPayload, weekOId)

        for (let dayIdx = 0; dayIdx < 6; dayIdx++) {
          const _prev = commentsArr[wIdx][dayIdx]
          const _next = weeklyRecord.colInfo.dateInfo[dayIdx].comments

          if (_prev !== _next) throw `${wIdx} 주차의 ${dayIdx} 일자의 코멘트 에러`
        }
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _SetWeek1(db: Db, logLevel: number) {
    try {
      const {commentsArr, jwtPayload, name, weekRowsArr} = this
      const weekIdx = 1
      const {weekOId} = weekRowsArr[weekIdx]

      // 이 주차의 각 입력마다 모든 일자의 데이터가 제대로 되어있는가가
      for (let dayIdx = 0; dayIdx < 6; dayIdx++) {
        const comments = name + dayIdx
        commentsArr[weekIdx][dayIdx] = comments

        const data: SetCommentDataType = {comments, dayIdx, weekOId}
        const {weeklyRecord} = await this.portService.setComments(jwtPayload, data)

        for (let checkIdx = 0; checkIdx < 6; checkIdx++) {
          const _prev = commentsArr[weekIdx][checkIdx]
          const _next = weeklyRecord.colInfo.dateInfo[checkIdx].comments

          if (_prev !== _next) throw `${weekIdx} 주차의 ${checkIdx} 일자의 코멘트 에러`
        }
      }

      // 다른 주차의 데이터가 바뀌진 않았나 체크
      for (let wIdx = 0; wIdx < 3; wIdx++) {
        // 중복 체크는 피하자.
        if (wIdx === weekIdx) continue

        const {weekOId} = weekRowsArr[wIdx]
        const {weeklyRecord} = await this.portService.getWeeklyRecord(jwtPayload, weekOId)

        for (let dayIdx = 0; dayIdx < 6; dayIdx++) {
          const _prev = commentsArr[wIdx][dayIdx]
          const _next = weeklyRecord.colInfo.dateInfo[dayIdx].comments

          if (_prev !== _next) throw `${wIdx} 주차의 ${dayIdx} 일자의 코멘트 에러`
        }
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _SetWeek2(db: Db, logLevel: number) {
    try {
      const {commentsArr, jwtPayload, name, weekRowsArr} = this
      const weekIdx = 2
      const {weekOId} = weekRowsArr[weekIdx]

      // 이 주차의 각 입력마다 모든 일자의 데이터가 제대로 되어있는가가
      for (let dayIdx = 0; dayIdx < 6; dayIdx++) {
        const comments = name + dayIdx
        commentsArr[weekIdx][dayIdx] = comments

        const data: SetCommentDataType = {comments, dayIdx, weekOId}
        const {weeklyRecord} = await this.portService.setComments(jwtPayload, data)

        for (let checkIdx = 0; checkIdx < 6; checkIdx++) {
          const _prev = commentsArr[weekIdx][checkIdx]
          const _next = weeklyRecord.colInfo.dateInfo[checkIdx].comments

          if (_prev !== _next) throw `${weekIdx} 주차의 ${checkIdx} 일자의 코멘트 에러`
        }
      }

      // 다른 주차의 데이터가 바뀌진 않았나 체크
      for (let wIdx = 0; wIdx < 3; wIdx++) {
        // 중복 체크는 피하자.
        if (wIdx === weekIdx) continue

        const {weekOId} = weekRowsArr[wIdx]
        const {weeklyRecord} = await this.portService.getWeeklyRecord(jwtPayload, weekOId)

        for (let dayIdx = 0; dayIdx < 6; dayIdx++) {
          const _prev = commentsArr[wIdx][dayIdx]
          const _next = weeklyRecord.colInfo.dateInfo[dayIdx].comments

          if (_prev !== _next) throw `${wIdx} 주차의 ${dayIdx} 일자의 코멘트 에러`
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
  const testModule = new WorkCorrect(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
