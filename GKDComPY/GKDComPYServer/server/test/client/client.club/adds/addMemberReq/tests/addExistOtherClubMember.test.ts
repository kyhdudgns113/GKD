import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {AddMemberDataType, EMemberType, JwtPayloadType} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 같은 공동체 내의 다른 클럽에 있는 멤버를 추가하는것을 테스트
 *   - 실패해야 한다.
 */
export class AddExistOtherClubMember extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId1: string
  private clubOId2: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private name: string
  private name1: string
  private name2: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const name = this.constructor.name
      const name1 = name + 1
      const name2 = name + 2
      const jwtPayload: JwtPayloadType = {id, uOId}

      const club1 = await this.db.collection('clubs').insertOne({commOId, name: name1})
      const club2 = await this.db.collection('clubs').insertOne({commOId, name: name2})

      const clubOId1 = club1.insertedId.toString()
      const clubOId2 = club2.insertedId.toString()

      const eMembersArr: EMemberType[] = []
      const colIdx = 3
      await this.db
        .collection('emembers')
        .insertOne({commOId, clubOId: clubOId1, colIdx, eMembersArr})
      await this.db
        .collection('emembers')
        .insertOne({commOId, clubOId: clubOId2, colIdx: 4, eMembersArr})

      const {clubOIdsArr, name: commName} = this.testDB.readComm(0).comm
      clubOIdsArr.push(clubOId1)
      clubOIdsArr.push(clubOId2)
      await this.db.collection('communities').updateOne({name: commName}, {$set: {clubOIdsArr}})

      this.clubOId1 = clubOId1
      this.clubOId2 = clubOId2
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.name = name
      this.name1 = name1
      this.name2 = name2
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {clubOId1, clubOId2, commOId, jwtPayload} = this
      const {name} = this

      const [batterPower, pitcherPower] = [0, 0]

      const data1: AddMemberDataType = {commOId, clubOId: clubOId1, name, batterPower, pitcherPower}
      const data2: AddMemberDataType = {commOId, clubOId: clubOId2, name, batterPower, pitcherPower}

      await this.portService.addMemberReqByClub(jwtPayload, data1)
      await this.portService.addMemberReqByClub(jwtPayload, data2)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId1, clubOId2, commOId, name, name1, name2} = this

      await this.db.collection('members').deleteOne({clubOId: clubOId1, name})
      await this.db.collection('members').deleteOne({clubOId: clubOId2, name})
      await this.db.collection('clubs').deleteOne({commOId, name: name1})
      await this.db.collection('clubs').deleteOne({commOId, name: name2})
      await this.db.collection('emembers').deleteOne({commOId, clubOId: clubOId1, colIdx: 3})
      await this.db.collection('emembers').deleteOne({commOId, clubOId: clubOId2, colIdx: 3})

      const {clubOIdsArr, name: commName} = this.testDB.readComm(0).comm
      while (clubOIdsArr.length > 3) clubOIdsArr.pop()

      await this.db.collection('communities').updateOne({name: commName}, {$set: {clubOIdsArr}})

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
  const testModule = new AddExistOtherClubMember(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
