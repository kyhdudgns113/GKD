import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {JwtPayloadType} from '../../../../../../src/common/types'
import {Types} from 'mongoose'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class TryToOtherClub extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService
  private clubOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const clubRes = await db
        .collection('clubs')
        .insertOne({commOId, name: this.constructor.name, weekRowsArr: []})
      const clubOId = clubRes.insertedId.toString()
      this.clubOId = clubOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.readUser(1, 2)
      const jwtPayload: JwtPayloadType = user
      await this.portService.getWeekRowsArr(jwtPayload, this.clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('clubs').deleteOne({_id: new Types.ObjectId(this.clubOId)})
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
  const testModule = new TryToOtherClub(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
