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
  AddRowMemberDataType,
  JwtPayloadType,
  SetCommentDataType,
  SetRowMemberDataType
} from '../../../../../../src/common/types'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class BlockedTrying extends GKDTestBase {
  private portService: ClientPortService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private memOId: string
  private name: string
  private weekOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 0).user

      const name = this.constructor.name
      const jwtPayload: JwtPayloadType = {id, uOId}
      const jwtPayload2 = this.testDB.readUser(0, 2).user

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

      const data: AddNextWeekDataType = {clubOId}
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload2, data)
      const {weekOId} = weekRowsArr[0]

      const [position, batterPower, pitcherPower] = [0, 0, 0]

      const data0: AddRowMemberDataType = {weekOId, position, name, batterPower, pitcherPower}
      const {weeklyRecord} = await this.portService.addRowMember(jwtPayload2, data0)
      const {memOId} = weeklyRecord.rowInfo.membersInfo[0]

      this.clubOId = clubOId
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.memOId = memOId
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
      const {jwtPayload, memOId, name, weekOId} = this
      const [batterPower, pitcherPower, prevName] = [1, 1, name]
      const position = 0

      const data: SetRowMemberDataType = {
        batterPower,
        memOId,
        name: name + 0,
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
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {commOId, clubOId, name} = this

      await this.db.collection('weeklyrecords').deleteOne({clubOId})
      await this.db.collection('clubs').deleteOne({commOId, name})
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
  const testModule = new BlockedTrying(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
