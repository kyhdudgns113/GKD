import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {JwtPayloadType} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class TryToOtherComm extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private commOId: string
  private clubOId: string
  private jwtPayload: JwtPayloadType
  private memOId: string
  private name: string // comm 의 이름이다.

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const name = `test${this.constructor.name}`
      const commRes = await this.db.collection('communities').insertOne({name})
      const commOId = commRes.insertedId.toString()

      const clubName = `testClub${this.constructor.name}`
      const clubRes = await this.db.collection('clubs').insertOne({name: clubName, commOId})
      const clubOId = clubRes.insertedId.toString()

      const mName = `testMem${this.constructor.name}`
      const memRes = await this.db.collection('members').insertOne({name: mName, commOId, clubOId})
      const memOId = memRes.insertedId.toString()

      const {id, uOId} = this.testDB.readUser(0, 2).user
      const jwtPayload: JwtPayloadType = {id, uOId}

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
      const {clubOId, jwtPayload, memOId} = this
      await this.portService.deleteClubMember(jwtPayload, clubOId, memOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, name} = this
      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('clubs').deleteMany({commOId})
      await this.db.collection('communities').deleteOne({name})
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
  const testModule = new TryToOtherComm(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
