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
 * 공동체 1의 새 클럽에서 공동체 0의 후보군 클럽으로 이동을 시도한다.
 *   - 실패해야 한다.
 */
export class TryMineToOther extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

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
      const {commOId} = this.testDB.readComm(1).comm
      const {id, uOId} = this.testDB.readUser(1, 2).user

      const name = this.constructor.name
      const jwtPayload: JwtPayloadType = {id, uOId}

      const data: AddClubDataType = {commOId, name}
      const {clubsArr} = await this.portService.addClubByMain(jwtPayload, data)
      const clubOId = clubsArr[3].clubOId

      const [batterPower, pitcherPower] = [0, 0]
      const data2: AddMemberDataType = {name, commOId, clubOId, batterPower, pitcherPower}
      const {members} = await this.portService.addMemberReqByClub(jwtPayload, data2)
      const memOId = Object.keys(members)[0]

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
      const {memOId, jwtPayload} = this
      const {clubOId} = this.testDB.readClub(0, 0).club // 이거 써야한다. 클럽이 다르다.

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
      const {clubOId, commOId, name} = this

      await this.db.collection('members').deleteOne({clubOId, commOId, name})
      await this.db.collection('emembers').deleteOne({clubOId, commOId, name})
      await this.db.collection('clubs').deleteOne({commOId, name})

      const {clubOIdsArr: arr1, name: commName1} = this.testDB.readComm(1).comm
      while (arr1.length > 3) arr1.pop()
      await this.db
        .collection('communities')
        .updateOne({name: commName1}, {$set: {clubOIdsArr: arr1}})
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
  const testModule = new TryMineToOther(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
