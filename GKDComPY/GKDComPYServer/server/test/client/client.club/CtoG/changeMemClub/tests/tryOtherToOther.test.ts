import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {
  AddClubDataType,
  AddMemberDataType,
  ChangeMemClubDataType,
  JwtPayloadType
} from 'src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 공동체 1의 유저가 공동체 0의 멤버를 공동체 0으로 옮기는것을 테스트
 * - 실패해야 한다.
 */
export class TryOtherToOther extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId00: string
  private clubOId01: string
  private commOId0: string
  private jwtPayload1: JwtPayloadType
  private memOId: string
  private name: string
  private name0: string
  private name1: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId: commOId0} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(1, 2).user
      const {id: _id, uOId: _uOId} = this.testDB.readUser(0, 2).user

      const name = this.constructor.name
      const name0 = name + 0
      const name1 = name + 1
      const jwtPayload0: JwtPayloadType = {id: _id, uOId: _uOId}
      const jwtPayload1: JwtPayloadType = {id, uOId}

      const data0: AddClubDataType = {commOId: commOId0, name: name0}
      const data1: AddClubDataType = {commOId: commOId0, name: name1}
      await this.portService.addClubByMain(jwtPayload0, data0)
      const {clubsArr} = await this.portService.addClubByMain(jwtPayload0, data1)
      const clubOId00 = clubsArr[3].clubOId
      const clubOId01 = clubsArr[3].clubOId

      const [batterPower, pitcherPower] = [0, 0]
      const dataMem: AddMemberDataType = {
        batterPower,
        commOId: commOId0,
        clubOId: clubOId00,
        name,
        pitcherPower
      }
      const {members} = await this.portService.addMemberReqByClub(jwtPayload0, dataMem)
      const memOId = Object.keys(members)[0]

      this.clubOId00 = clubOId00
      this.clubOId01 = clubOId01
      this.commOId0 = commOId0
      this.jwtPayload1 = jwtPayload1
      this.memOId = memOId
      this.name = name
      this.name0 = name0
      this.name1 = name1
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {clubOId01: clubOId, jwtPayload1: jwtPayload, memOId} = this

      const data: ChangeMemClubDataType = {memOId, clubOId}

      await this.portService.changeMemClub(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId00, clubOId01, commOId0: commOId, name, name0, name1} = this

      await this.db.collection('members').deleteOne({clubOId: clubOId00})
      await this.db.collection('members').deleteOne({clubOId: clubOId01})

      await this.db.collection('clubs').deleteOne({commOId, name: name0})
      await this.db.collection('clubs').deleteOne({commOId, name: name1})
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
  const testModule = new TryOtherToOther(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
