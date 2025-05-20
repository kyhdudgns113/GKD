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
  AddMemberDataType,
  AddNextWeekDataType,
  AddRowMemberDataType,
  JwtPayloadType,
  SetDailyRecordType,
  SetRowMemberDataType
} from '../../../../../../src/common/types'
import {shiftDateValue} from '../../../../../../src/common/utils'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 에러값마다 테스트를 한다.
 *   - 통과해야 한다.
 *     - 모든 에러값들을 검출하는지를 테스트하기 때문
 */
export class TryErrorValue extends GKDTestBase {
  private portService: ClientPortService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private memOId: string
  private memOIdClub: string
  private memOIdRow: string
  private name: string
  private weekOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  /**
   * 1. 클럽멤버 1명 만들고 주차를 추가한다. \
   * 2. 그 다음 대전기록용 멤버 1명 만든다. \
   * 3. 그리고 클럽멤버 1명을 만든다. \
   *
   * 최종적으로 대전기록에는 0번째, 1번째 멤버가 있고
   * 2번째 멤버는 대전기록에는 없을것이다.
   */
  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const nameBase = this.constructor.name
      let name = nameBase
      const jwtPayload: JwtPayloadType = {id, uOId}

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

      const [position, batterPower, pitcherPower] = [0, 0, 0]
      let [memOId, memOIdClub, memOIdRow, weekOId] = ['', '', '', '']
      let weeklyRecord = null

      // 0번째 멤버: 클럽에도 있고, 대전기록에도 있는 멤버
      if (!memOId) {
        name = nameBase + 0
        const data0: AddMemberDataType = {name, commOId, clubOId, batterPower, pitcherPower}
        const {members: members0} = await this.portService.addMemberReqByClub(jwtPayload, data0)

        const numMem = Object.keys(members0).length
        if (numMem !== 1) throw `BEFORE: 멤버가 왜 1이 아니지? ${numMem}`
        memOId = Object.keys(members0)[0]
      }

      // 주차 추가
      if (!weekOId) {
        const dataWeek: AddNextWeekDataType = {clubOId}
        const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, dataWeek)
        weekOId = weekRowsArr[0].weekOId
      }

      // 1번째 멤버: 대전기록에만 있는 멤버
      if (!memOIdRow) {
        name = nameBase + 1
        const data1: AddRowMemberDataType = {weekOId, position, name, batterPower, pitcherPower}
        const {weeklyRecord} = await this.portService.addRowMember(jwtPayload, data1)
        memOIdRow = weeklyRecord.rowInfo.membersInfo[0].memOId
      }

      // 2번째 멤버: 클럽에만 있는 멤버
      if (!memOIdClub) {
        name = nameBase + 2
        const data2: AddMemberDataType = {name, commOId, clubOId, batterPower, pitcherPower}
        const {members: members2} = await this.portService.addMemberReqByClub(jwtPayload, data2)
        memOIdClub = Object.keys(members2).filter(_memOId => _memOId !== memOId)[0]
      }

      // 대전기록 1개씩 넣기
      if (!weeklyRecord) {
        weeklyRecord = (await this.portService.getWeeklyRecord(jwtPayload, weekOId)).weeklyRecord
        const {start, end} = weeklyRecord
        const data0: SetDailyRecordType = {
          clubOId,
          start,
          end,
          date: shiftDateValue(start, 0),
          name: nameBase + 0,
          condError: 0,
          results: [0, 0, 0],
          comment: nameBase,
          memOId
        }
        await this.portService.submitRecord(jwtPayload, data0)

        const data1: SetDailyRecordType = {
          clubOId,
          start,
          end,
          date: shiftDateValue(start, 1),
          name: nameBase + 1,
          condError: 0,
          results: [0, 0, 0],
          comment: nameBase,
          memOId: memOIdRow
        }
        await this.portService.submitRecord(jwtPayload, data1)
      }

      this.clubOId = clubOId
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.memOId = memOId
      this.memOIdClub = memOIdClub
      this.memOIdRow = memOIdRow
      this.name = nameBase
      this.weekOId = weekOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._errorWeekOId.bind(this), db, logLevel)
      await this.memberFail(this._errorPrevName.bind(this), db, logLevel)
      await this.memberFail(this._positionUnder.bind(this), db, logLevel)
      await this.memberFail(this._positionOver.bind(this), db, logLevel)
      await this.memberFail(this._tryOnlyInClub.bind(this), db, logLevel)
      // name, memOId 는 에러체크 안한다.
      // 중복일수도 있고, null 일 수도 있다.
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {commOId, clubOId, name} = this

      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('dailyrecords').deleteMany({clubOId})
      await this.db.collection('weeklyrecords').deleteOne({clubOId})
      await this.db.collection('clubs').deleteOne({commOId, name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _errorWeekOId(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOId, name} = this
      const [batterPower, pitcherPower, prevName] = [0, 0, name + 0]
      const [position] = [0]
      const weekOId = 'error  WeekOId'

      const data: SetRowMemberDataType = {
        batterPower,
        memOId,
        name: '1' + name,
        pitcherPower,
        position,
        prevName,
        weekOId
      }
      await this.portService.setRowMember(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _errorPrevName(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOId, name, weekOId} = this
      const [batterPower, pitcherPower, prevName] = [0, 0, name]
      const [position] = [0]

      const data: SetRowMemberDataType = {
        batterPower,
        memOId,
        name: '1' + name,
        pitcherPower,
        position,
        prevName,
        weekOId
      }
      await this.portService.setRowMember(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _positionUnder(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOId, name, weekOId} = this
      const [batterPower, pitcherPower, prevName] = [0, 0, name + 0]
      const [position] = [-1]

      const data: SetRowMemberDataType = {
        batterPower,
        memOId,
        name: '1' + name,
        pitcherPower,
        position,
        prevName,
        weekOId
      }
      await this.portService.setRowMember(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _positionOver(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOId, name, weekOId} = this
      const [batterPower, pitcherPower, prevName] = [0, 0, name + 0]
      const [position] = [3]

      const data: SetRowMemberDataType = {
        batterPower,
        memOId,
        name: '1' + name,
        pitcherPower,
        position,
        prevName,
        weekOId
      }
      await this.portService.setRowMember(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _tryOnlyInClub(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOIdClub, name, weekOId} = this
      const [batterPower, pitcherPower, prevName] = [0, 0, name + 2]
      const [position] = [1]

      const data: SetRowMemberDataType = {
        batterPower,
        memOId: memOIdClub,
        name: '1' + name,
        pitcherPower,
        position,
        prevName,
        weekOId
      }
      await this.portService.setRowMember(jwtPayload, data)
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
  const testModule = new TryErrorValue(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
