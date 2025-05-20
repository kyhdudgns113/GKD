import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {JwtPayloadType} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class BlockedTrying extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private commOId: string
  private clubOId: string
  private jwtPayload: JwtPayloadType
  private name: string // 클럽의 이름이다.

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 0).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name
      const clubRes = await this.db.collection('clubs').insertOne({name, commOId})

      this.commOId = commOId
      this.clubOId = clubRes.insertedId.toString()
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
      const {clubOId, commOId, jwtPayload, name} = this

      const memRes = await this.db.collection('members').insertOne({commOId, clubOId, name})
      const memOId = memRes.insertedId.toString()

      const {dailyRecordsArr} = await this.portService.getMemberRecordsArr(jwtPayload, memOId, 28)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, name} = this

      await this.db.collection('members').deleteMany({clubOId})
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
  const testModule = new BlockedTrying(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
