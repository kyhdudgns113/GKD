/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {
  AddMemberDataType,
  JwtPayloadType,
  SetMemberCommentDataType
} from '../../../../../../src/common/types'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class BlockTrying extends GKDTestBase {
  private portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private jwtPayload0: JwtPayloadType
  private jwtPayload2: JwtPayloadType
  private memOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {clubOId} = this.testDB.readClub(0, 0).club
      const {id: _id, uOId: _uOId} = this.testDB.readUser(0, 2).user

      // 테스트용 멤버를 만든다.
      const _jwtPayload: JwtPayloadType = {id: _id, uOId: _uOId}
      const name = this.constructor.name
      const batterPower = 0
      const pitcherPower = 0

      const data: AddMemberDataType = {name, commOId, clubOId, batterPower, pitcherPower}
      const {members} = await this.portService.addMemberReqByClub(_jwtPayload, data)
      const memOId = Object.keys(members)[0]

      // 실제 테스트는 이 친구로 돌린다.
      const {id: id0, uOId: uOId0} = this.testDB.readUser(0, 0).user
      const jwtPayload0: JwtPayloadType = {id: id0, uOId: uOId0}

      // DB 리셋할땐 이게 필요하다
      const {id: id2, uOId: uOId2} = this.testDB.readUser(0, 2).user
      const jwtPayload2: JwtPayloadType = {id: id2, uOId: uOId2}

      this.clubOId = clubOId
      this.jwtPayload0 = jwtPayload0
      this.jwtPayload2 = jwtPayload2
      this.memOId = memOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload0: jwtPayload, memOId} = this

      const memberComment = '테스트용 코멘트'
      const data: SetMemberCommentDataType = {clubOId, memOId, memberComment}

      await this.portService.setMemComment(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload2: jwtPayload, memOId} = this
      await this.portService.deleteClubMember(jwtPayload, clubOId, memOId)
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
  const testModule = new BlockTrying(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
