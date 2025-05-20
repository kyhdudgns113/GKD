import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {AddMemberDataType, EMemberType, JwtPayloadType} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class AddExistMember extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private commOId: string
  private clubOId: string
  private jwtPayload: JwtPayloadType
  private name: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const name = this.constructor.name
      const jwtPayload: JwtPayloadType = {id, uOId}

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

      const eMembersArr: EMemberType[] = []
      const colIdx = 3
      await this.db.collection('emembers').insertOne({commOId, clubOId, colIdx, eMembersArr})

      const {clubOIdsArr, name: commName} = this.testDB.readComm(0).comm
      clubOIdsArr.push(clubOId)
      await this.db.collection('communities').updateOne({name: commName}, {$set: {clubOIdsArr}})

      this.commOId = commOId
      this.clubOId = clubOId
      this.jwtPayload = jwtPayload
      this.name = name
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {commOId, clubOId, name, jwtPayload} = this
      const [batterPower, pitcherPower] = [0, 0]

      const data: AddMemberDataType = {commOId, clubOId, name, batterPower, pitcherPower}

      await this.portService.addMemberReqByClub(jwtPayload, data)
      await this.portService.addMemberReqByClub(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {commOId, clubOId, name} = this

      await this.db.collection('members').deleteMany({commOId, clubOId})
      await this.db.collection('clubs').deleteOne({name})
      await this.db.collection('emembers').deleteOne({commOId, clubOId, colIdx: 3})

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
  const testModule = new AddExistMember(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
