import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {DeleteRowMemDataType, JwtPayloadType} from '../../../../../../src/common/types'
import {Types} from 'mongoose'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 만약 row 에 멤버가 없다면 rowInfo 에서 실제 삭제가 이루어지진 않으므로 괜찮다 \
 * 다만, club 에서 삭제가 되면 안되기 때문에 이를 체크한다 \
 */
export class TryToDeleteOnlyInClub extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
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
      const {id, uOId} = this.testDB.readUser(0, 1).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name

      const clubRes = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubRes.insertedId.toString()

      const memRes = await this.db.collection('members').insertOne({name, clubOId, commOId})
      const memOId = memRes.insertedId.toString()

      const weekRes = await this.db
        .collection('weeklyrecords')
        .insertOne({clubOId, start: 101, end: 107, rowInfo: {clubOId, membersInfo: []}})
      const weekOId = weekRes.insertedId.toString()

      this.clubOId = clubOId
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
      const {clubOId, jwtPayload, memOId, name, weekOId} = this

      const data: DeleteRowMemDataType = {weekOId, name}
      await this.portService.deleteRowMember(jwtPayload, data)

      const {members} = await this.portService.getMembersByClub(jwtPayload, clubOId)
      if (!members[memOId]) throw `왜 클럽의 멤버가 지워지냐`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest() {
    try {
      const {clubOId, name} = this

      await this.db.collection('members').deleteOne({name})
      await this.db.collection('weeklyrecords').deleteMany({clubOId})
      await this.db.collection('clubs').deleteOne({name})
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
  const testModule = new TryToDeleteOnlyInClub(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
