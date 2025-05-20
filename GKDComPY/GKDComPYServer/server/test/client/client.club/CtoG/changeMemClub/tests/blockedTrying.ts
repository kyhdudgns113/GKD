import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {
  AddClubDataType,
  AddMemberDataType,
  ChangeMemClubDataType,
  EMemberType,
  JwtPayloadType
} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class BlockedTrying extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private jwtPayload2: JwtPayloadType
  private name: string
  private memOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 0).user
      const {id: id2, uOId: uOId2} = this.testDB.readUser(0, 2).user

      const name = this.constructor.name
      const jwtPayload: JwtPayloadType = {id, uOId}
      const jwtPayload2: JwtPayloadType = {id: id2, uOId: uOId2}

      const data: AddClubDataType = {commOId, name}
      const {clubsArr} = await this.portService.addClubByMain(jwtPayload2, data)
      const clubOId = clubsArr[3].clubOId

      const [batterPower, pitcherPower] = [0, 0]
      const data2: AddMemberDataType = {name, commOId, clubOId, batterPower, pitcherPower}
      const {members} = await this.portService.addMemberReqByClub(jwtPayload2, data2)
      const memOId = Object.keys(members)[0]

      this.clubOId = clubOId
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.jwtPayload2 = jwtPayload2
      this.name = name
      this.memOId = memOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload, memOId} = this

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

      await this.db.collection('members').deleteOne({clubOId, name})
      await this.db.collection('clubs').deleteOne({commOId, name})
      await this.db.collection('emembers').deleteOne({clubOId})

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
  const testModule = new BlockedTrying(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
