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
 * 이름은 좀 이상한데, 그냥 workCorrect 이다.
 */
export class ChangeOneToOne extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private clubOId1: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private memOId: string
  private name: string
  private name1: string
  private prevOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const name = this.constructor.name
      const name1 = name + 1
      const jwtPayload: JwtPayloadType = {id, uOId}

      const data: AddClubDataType = {commOId, name}
      const {clubsArr} = await this.portService.addClubByMain(jwtPayload, data)
      const clubOId = clubsArr[3].clubOId

      const data1: AddClubDataType = {commOId, name: name1}
      const {clubsArr: _arr} = await this.portService.addClubByMain(jwtPayload, data1)
      const clubOId1 = _arr[4].clubOId

      const [batterPower, pitcherPower] = [0, 0]
      const data2: AddMemberDataType = {name, commOId, clubOId, batterPower, pitcherPower}
      const {members} = await this.portService.addMemberReqByClub(jwtPayload, data2)
      const memOId = Object.keys(members)[0]

      this.clubOId = clubOId1
      this.clubOId1 = clubOId
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.memOId = memOId
      this.name = name
      this.name1 = name1
      this.prevOId = clubOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._testOnlyOneMember.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, clubOId1, commOId, name, name1, prevOId} = this

      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('members').deleteMany({clubOId: prevOId})
      await this.db.collection('clubs').deleteOne({commOId, name})
      await this.db.collection('clubs').deleteOne({commOId, name: name1})
      await this.db.collection('emembers').deleteOne({clubOId})
      await this.db.collection('emembers').deleteOne({clubOId: clubOId1})

      const {clubOIdsArr, name: commName} = this.testDB.readComm(0).comm
      while (clubOIdsArr.length > 3) clubOIdsArr.pop()

      await this.db.collection('communities').updateOne({name: commName}, {$set: {clubOIdsArr}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * 한 명의 멤버만 있을때의 이동을 테스트한다.
   */
  private async _testOnlyOneMember(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload, name, memOId} = this

      const data: ChangeMemClubDataType = {memOId, clubOId}

      const {members: prevMembers} = await this.portService.changeMemClub(jwtPayload, data)
      const {members} = await this.portService.getMembersByClub(jwtPayload, clubOId)

      if (prevMembers[memOId]) throw `이전 클럽에 멤버가 왜 있을까`
      if (!members[memOId]) throw `members 에 왜 이 멤버가 없지?`
      if (members[memOId].memOId !== memOId) throw `왜 이상한 OID가가 들어가있지?`
      if (members[memOId].name !== name) throw `왜 이름이 이상하게 들어갔지?`
      if (Object.keys(members).length !== 1) throw '왜 members 길이가 이상하지?'
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
  const testModule = new ChangeOneToOne(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
