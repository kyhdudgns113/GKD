import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {Types} from 'mongoose'
import {
  AddNextWeekDataType,
  AddRowMemberDataType,
  JwtPayloadType
} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class BlockedTryToAdd extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private jwtPayload: JwtPayloadType
  private name: string
  private weekOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id: _id, uOId: _uOId} = this.testDB.readUser(0, 2).user

      const _jwtPayload: JwtPayloadType = {id: _id, uOId: _uOId}
      const name = this.constructor.name

      const clubRes = await this.db.collection('clubs').insertOne({commOId, name: name + 0})
      const clubOId = clubRes.insertedId.toString()

      const data: AddNextWeekDataType = {clubOId}
      const {weekRowsArr} = await this.portService.addNextWeek(_jwtPayload, data)

      const {id, uOId} = this.testDB.readUser(0, 0).user
      const jwtPayload: JwtPayloadType = {id, uOId}

      this.clubOId = clubOId
      this.jwtPayload = jwtPayload
      this.name = name
      this.weekOId = weekRowsArr[0].weekOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {jwtPayload, name, weekOId} = this
      const data: AddRowMemberDataType = {
        weekOId: weekOId,
        position: 0,
        name,
        batterPower: 0,
        pitcherPower: 0
      }
      await this.portService.addRowMember(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, name} = this

      await this.db.collection('clubs').deleteOne({name})
      await this.db.collection('weeklyrecords').deleteOne({clubOId})
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
