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
} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 공동체 1의 유저가 공동체 0에 있는 멤버를 데려오려고 시도한다.
 *   - 실패해야 한다.
 */
export class TryOtherToMine extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId0: string
  private clubOId1: string
  private commOId0: string
  private commOId1: string
  private jwtPayload0: JwtPayloadType
  private jwtPayload1: JwtPayloadType
  private memOId: string
  private name: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId: commOId0} = this.testDB.readComm(0).comm
      const {commOId: commOId1} = this.testDB.readComm(1).comm
      const {id, uOId} = this.testDB.readUser(1, 2).user
      const {id: _id, uOId: _uOId} = this.testDB.readUser(0, 2).user

      const name = this.constructor.name
      const jwtPayload1: JwtPayloadType = {id, uOId}
      const jwtPayload0: JwtPayloadType = {id: _id, uOId: _uOId}

      const data: AddClubDataType = {commOId: commOId1, name}
      const {clubsArr} = await this.portService.addClubByMain(jwtPayload1, data)
      const clubOId1 = clubsArr[3].clubOId

      const [batterPower, pitcherPower] = [0, 0]
      const data1: AddMemberDataType = {
        name,
        commOId: commOId1,
        clubOId: clubOId1,
        batterPower,
        pitcherPower
      }
      const {members} = await this.portService.addMemberReqByClub(jwtPayload1, data1)
      const memOId = Object.keys(members)[0]

      const data2: AddClubDataType = {commOId: commOId0, name}
      const {clubsArr: _arr} = await this.portService.addClubByMain(jwtPayload0, data2)
      const clubOId0 = _arr[3].clubOId

      this.clubOId0 = clubOId0
      this.clubOId1 = clubOId1
      this.commOId0 = commOId0
      this.commOId1 = commOId1
      this.jwtPayload0 = jwtPayload0
      this.jwtPayload1 = jwtPayload1
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
      const {clubOId0: clubOId, jwtPayload0: jwtPayload, memOId} = this

      const data: ChangeMemClubDataType = {clubOId, memOId}

      await this.portService.changeMemClub(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId0, clubOId1, commOId0, commOId1, name} = this

      await this.db.collection('members').deleteMany({clubOId: clubOId0})
      await this.db.collection('members').deleteMany({clubOId: clubOId1})

      await this.db.collection('clubs').deleteOne({commOId: commOId0, name})
      await this.db.collection('clubs').deleteOne({commOId: commOId1, name})

      await this.db.collection('emembers').deleteOne({clubOId: clubOId0})
      await this.db.collection('emembers').deleteOne({clubOId: clubOId1})

      const {clubOIdsArr: _arr0, name: commName0} = this.testDB.readComm(0).comm
      while (_arr0.length > 3) _arr0.pop()
      await this.db
        .collection('communities')
        .updateOne({name: commName0}, {$set: {clubOIdsArr: _arr0}})

      const {clubOIdsArr: _arr1, name: commName1} = this.testDB.readComm(1).comm
      while (_arr1.length > 3) _arr1.pop()
      await this.db
        .collection('communities')
        .updateOne({name: commName1}, {$set: {clubOIdsArr: _arr1}})
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
  const testModule = new TryOtherToMine(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
