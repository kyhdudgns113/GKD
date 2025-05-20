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
  SetRowMemberDataType,
  WeeklyRecordType
} from '../../../../../../src/common/types'
import {shiftDateValue} from '../../../../../../src/common/utils'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 *
 */
export class WorkCorrect extends GKDTestBase {
  private portService: ClientPortService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private memOId: string
  private memOIdClub: string
  private memOIdRow: string
  private name: string
  private weeklyRecord: WeeklyRecordType
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
        memOIdRow = weeklyRecord.rowInfo.membersInfo.filter(memInfo => memInfo.memOId !== memOId)[0]
          .memOId
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
      this.weeklyRecord = weeklyRecord
      this.weekOId = weekOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._ChangeMemberBoth.bind(this), db, logLevel)
      await this.memberOK(this._ChangeMemberRecord.bind(this), db, logLevel)
      // 클럽에 있고, 대전기록에 없는 멤버의 경우는 tryErrorValue 에서 테스트함
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

  /**
   * 0 번째 멤버(클럽, 대전기록에 존재)를 바꿔본다. \
   * - 입력한 정보대로 바뀌었나 확인한다.
   * - 다른 멤버의 정보가 바뀐건 아닌가 확인한다.
   */
  private async _ChangeMemberBoth(db: Db, logLevel: number) {
    try {
      const {jwtPayload, clubOId, memOId, name, weeklyRecord: prevWeekly, weekOId} = this
      const [batterPower, pitcherPower, position] = [1, 1, 1]
      const prevName = name + 0
      // 코드 닫기를 위한 변수이다. 특별히 어떤 의미를 가지진 않는다.
      let [checkWeek, check0, check1, check2] = [false, false, false, false]

      const data: SetRowMemberDataType = {
        batterPower,
        memOId,
        name,
        pitcherPower,
        position,
        prevName,
        weekOId
      }
      const {recordsArr, weeklyRecord} = await this.portService.setRowMember(jwtPayload, data)

      // 0. 주간 정보가 바뀌면 안되며, 이를 테스트한다.
      if (!checkWeek) {
        const [clubOId0, clubOId1] = [prevWeekly.clubOId, weeklyRecord.clubOId]
        if (clubOId0 !== clubOId1) throw `clubOId 가 원래:${clubOId0}, 바뀐값:${clubOId1}`

        const [start0, start1] = [prevWeekly.start, weeklyRecord.start]
        if (start0 !== start1) throw `start 가 원래:${start0}, 바뀐값:${start1}`

        const [end0, end1] = [prevWeekly.end, weeklyRecord.end]
        if (end0 !== end1) throw `end 가 원래:${end0}, 바뀐값:${end1}`

        const [title0, title1] = [prevWeekly.title, weeklyRecord.title]
        if (title0 !== title1) throw `title 가 원래:${title0}, 바뀐값:${title1}`

        const [comment0, comment1] = [prevWeekly.comment, weeklyRecord.comment]
        if (comment0 !== comment1) throw `comment 가 원래:${comment0}, 바뀐값:${comment1}`

        const [prevCol, nowCol] = [
          JSON.stringify(prevWeekly.colInfo),
          JSON.stringify(weeklyRecord.colInfo)
        ]
        if (prevCol !== nowCol) throw `colInfo 가 다름 prev:${prevCol} vs aft:${nowCol}`

        if (weeklyRecord.rowInfo.clubOId !== clubOId) throw `clubOId 가 변경되면 안됨`

        checkWeek = true
      }

      // 1. 바꾸고자 한 정보가 제대로 바뀌었나 확인한다.
      if (!check0) {
        const member = weeklyRecord.rowInfo.membersInfo.filter(mem => mem.memOId === memOId)[0]

        if (!member) throw `1. memOId 가 바뀌어서 들어갔니?`
        if (member.name !== name) throw `1. 이름이 안 바뀌었어요`
        if (member.batterPower !== batterPower) throw `1. batterPower 가 안 바뀌었어요`
        if (member.pitcherPower !== pitcherPower) throw `1. pitcherPower 가 안 바뀌었어요`
        if (member.position !== position) throw `1. position 가 안 바뀌었어요`

        check0 = true
      }

      // 2. 대전기록용 멤버의 정보가 바뀐건 아닌가 확인한다.
      if (!check1) {
        const member = weeklyRecord.rowInfo.membersInfo.filter(mem => mem.memOId !== memOId)[0]
        const memPrev = prevWeekly.rowInfo.membersInfo.filter(mem => mem.memOId !== memOId)[0]

        if (!member) throw `2. 멤버가 그새 지워졌나?`
        if (member.name !== memPrev.name)
          throw `2. name이 ${memPrev.name} 에서 ${member.name} 으로 바뀜`
        if (member.batterPower !== memPrev.batterPower)
          throw `2. batterPower가 ${memPrev.batterPower} 에서 ${member.batterPower} 으로 바뀜`
        if (member.pitcherPower !== memPrev.pitcherPower)
          throw `2. pitcherPower가 ${memPrev.pitcherPower} 에서 ${member.pitcherPower} 으로 바뀜`
        if (member.position !== memPrev.position)
          throw `2. position이 ${memPrev.position} 에서 ${member.position} 으로 바뀜`

        check1 = true
      }

      // 3. 클럽에만 있는 멤버의 정보가 바뀐건 아닌가 확인한다.
      if (!check2) {
        const {memOIdClub} = this
        const {members} = await this.portService.getMembersByClub(jwtPayload, clubOId)
        const memAft = weeklyRecord.rowInfo.membersInfo.filter(mem => mem.memOId === memOIdClub)[0]
        const member = members[memOIdClub]

        if (memAft) throw `3. 멤버가 대체 왜 들어간거야`
        if (!member) throw `3. 멤버가 대체 왜 안 들어간거야`
        if (member.name !== name + 2) throw `3. 이름이 ${name + 2} 아닌 ${member.name}`
        if (member.batterPower !== 0) throw `3. BatterPower 가 왜 바뀜?`
        if (member.pitcherPower !== 0) throw `3. pitcherPower 가 왜 바뀜?`
        if (member.position !== 0) throw `3. position 이 왜 바뀜?`

        check2 = true
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _ChangeMemberRecord(db: Db, logLevel: number) {
    try {
      const {jwtPayload, clubOId, memOIdRow: memOId, name, weeklyRecord: prevWeekly, weekOId} = this
      const [batterPower, pitcherPower, position] = [1, 1, 1]
      const prevName = name + 1
      // 코드 닫기를 위한 변수이다. 특별히 어떤 의미를 가지진 않는다.
      let [checkWeek, check0, check1, check2] = [false, false, false, false]

      const data: SetRowMemberDataType = {
        batterPower,
        memOId,
        name,
        pitcherPower,
        position,
        prevName,
        weekOId
      }
      const {recordsArr, weeklyRecord} = await this.portService.setRowMember(jwtPayload, data)

      // 0. 주간 정보가 바뀌면 안되며, 이를 테스트한다.
      if (!checkWeek) {
        const [clubOId0, clubOId1] = [prevWeekly.clubOId, weeklyRecord.clubOId]
        if (clubOId0 !== clubOId1) throw `clubOId 가 원래:${clubOId0}, 바뀐값:${clubOId1}`

        const [start0, start1] = [prevWeekly.start, weeklyRecord.start]
        if (start0 !== start1) throw `start 가 원래:${start0}, 바뀐값:${start1}`

        const [end0, end1] = [prevWeekly.end, weeklyRecord.end]
        if (end0 !== end1) throw `end 가 원래:${end0}, 바뀐값:${end1}`

        const [title0, title1] = [prevWeekly.title, weeklyRecord.title]
        if (title0 !== title1) throw `title 가 원래:${title0}, 바뀐값:${title1}`

        const [comment0, comment1] = [prevWeekly.comment, weeklyRecord.comment]
        if (comment0 !== comment1) throw `comment 가 원래:${comment0}, 바뀐값:${comment1}`

        const [prevCol, nowCol] = [
          JSON.stringify(prevWeekly.colInfo),
          JSON.stringify(weeklyRecord.colInfo)
        ]
        if (prevCol !== nowCol) throw `colInfo 가 다름 prev:${prevCol} vs aft:${nowCol}`

        if (weeklyRecord.rowInfo.clubOId !== clubOId) throw `clubOId 가 변경되면 안됨`

        checkWeek = true
      }

      // 1. 바꾸고자 한 정보가 바뀐건 아닌가 확인한다.
      if (!check0) {
        const {memOId} = this
        const member = weeklyRecord.rowInfo.membersInfo.filter(mem => mem.memOId === memOId)[0]

        if (!member) throw `1. memOId 가 바뀌어서 들어갔니?`
        if (member.name !== name) throw `1. 이름이 바뀌면 안돼요`
        if (member.batterPower !== batterPower) throw `1. batterPower 가 바뀌면 안돼요.`
        if (member.pitcherPower !== pitcherPower) throw `1. pitcherPower 가 안 바뀌면 안돼요.`
        if (member.position !== position) throw `1. position 가 바뀌면 안돼요.`

        check0 = true
      }

      // 2. 대전기록용 멤버의 정보가 바뀐건 아닌가 확인한다.
      if (!check1) {
        const {memOId} = this
        const member = weeklyRecord.rowInfo.membersInfo.filter(mem => mem.memOId !== memOId)[0]

        if (!member) throw `2. 멤버가 그새 지워졌나?`
        if (member.name !== name) throw `2. name이 안 바뀌었어요`
        if (member.batterPower !== batterPower) throw `2. batterPower가 안 바뀌었어요`
        if (member.pitcherPower !== pitcherPower) throw `2. pitcherPower가 안 바뀌었어요`
        if (member.position !== position) throw `2. position이 안 바뀌었어요`

        check1 = true
      }

      // 3. 클럽에만 있는 멤버의 정보가 바뀐건 아닌가 확인한다.
      if (!check2) {
        const {memOIdClub} = this
        const {members} = await this.portService.getMembersByClub(jwtPayload, clubOId)
        const memAft = weeklyRecord.rowInfo.membersInfo.filter(mem => mem.memOId === memOIdClub)[0]
        const member = members[memOIdClub]

        if (memAft) throw `3. 멤버가 대체 왜 들어간거야`
        if (!member) throw `3. 멤버가 대체 왜 안 들어간거야`
        if (member.name !== name + 2) throw `3. 이름이 ${name + 2} 아닌 ${member.name}`
        if (member.batterPower !== 0) throw `3. BatterPower 가 왜 바뀜?`
        if (member.pitcherPower !== 0) throw `3. pitcherPower 가 왜 바뀜?`
        if (member.position !== 0) throw `3. position 이 왜 바뀜?`

        check2 = true
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
