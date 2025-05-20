/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {JwtPayloadType, SetMemberPowerDataType} from '../../../../../../src/common/types'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * batterPower 나 pitcherPower 가 음수인 경우를 체크한다.
 *   - 각자, 혹은 둘 다 음수인 경우를 전부 확인해야 한다.
 *   - 이 중 하나라도 에러가 안나면 테스트가 실패해야 한다.
 *   - 반대로 이것들이 전부 다 에러가 나면 테스트가 성공하는 것이다.
 *   - 따라서 TryErrorPower 는 그냥 통과가 되어야 한다.
 * name 이 에러인 경우도 테스트한다.
 *   - 일단은 중복만 테스트한다.
 */
export class TryErrorValue extends GKDTestBase {
  private portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private memOId: string
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

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

      const memDB = await this.db.collection('members').insertOne({commOId, clubOId, name})
      const memOId = memDB.insertedId.toString()

      this.clubOId = clubOId
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.memOId = memOId
      this.name = name
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._batterErr.bind(this), db, logLevel)
      await this.memberFail(this._pitcherErr.bind(this), db, logLevel)
      await this.memberFail(this._bothErr.bind(this), db, logLevel)
      await this.memberFail(this._sameNameErr.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, name} = this

      // 중복이름 테스트에서 혹여나 여러 멤버가 생성되었으면 다 지워야 한다.
      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('clubs').deleteOne({commOId, name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * batterPower 만 음수일때를 체크한다.
   */
  private async _batterErr(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOId, name} = this
      const [batterPower, pitcherPower] = [-1, 8000]

      const data: SetMemberPowerDataType = {memOId, name, batterPower, pitcherPower}
      await this.portService.setMemPowerByClubMember(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * pitcherPower 만 음수일때를 체크한다.
   */
  private async _pitcherErr(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOId, name} = this
      const [batterPower, pitcherPower] = [10000, -1]

      const data: SetMemberPowerDataType = {memOId, name, batterPower, pitcherPower}
      await this.portService.setMemPowerByClubMember(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 둘 다 음수일때를 체크한다.
   */
  private async _bothErr(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOId, name} = this
      const [batterPower, pitcherPower] = [-1, -1]

      const data: SetMemberPowerDataType = {memOId, name, batterPower, pitcherPower}
      await this.portService.setMemPowerByClubMember(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 이미 존재하는 이름으로 바꾸려는지 테스트한다.
   *   - 멤버 하나를 추가로 만든다.
   */
  private async _sameNameErr(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, jwtPayload, name} = this
      const [batterPower, pitcherPower] = [10000, 8000]

      const name1 = name + 1
      const mem1 = await this.db.collection('members').insertOne({clubOId, commOId, name: name1})
      const memOId = mem1.insertedId.toString()

      const data: SetMemberPowerDataType = {memOId, name, batterPower, pitcherPower}
      await this.portService.setMemPowerByClubMember(jwtPayload, data)
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
