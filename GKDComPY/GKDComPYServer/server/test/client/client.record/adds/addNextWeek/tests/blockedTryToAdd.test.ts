import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {AddNextWeekDataType, JwtPayloadType} from '../../../../../../src/common/types'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class BlockedTryToAdd extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private jwtPayload: JwtPayloadType
  private name: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 0).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

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
      const {clubOId, jwtPayload} = this

      const data: AddNextWeekDataType = {clubOId}
      await this.portService.addNextWeek(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {name} = this
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
  const testModule = new BlockedTryToAdd(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
