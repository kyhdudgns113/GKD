import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {
  AddNextWeekDataType,
  AddRowMemberDataType,
  JwtPayloadType
} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class AddMultiple extends GKDTestBase {
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
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name

      const clubRes = await this.db.collection('clubs').insertOne({commOId, name: name + 0})
      const clubOId = clubRes.insertedId.toString()

      const data: AddNextWeekDataType = {clubOId}
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, data)

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
      await this.memberOK(this._createFirst.bind(this), db, logLevel)
      await this.memberOK(this._createSecond.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, name} = this

      await this.db.collection('weeklyrecords').deleteMany({clubOId})
      await this.db.collection('clubs').deleteOne({name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _createFirst(db: Db, logLevel: number) {
    try {
      const {jwtPayload, name: _name, weekOId} = this

      const name = _name + 1
      const data: AddRowMemberDataType = {
        weekOId,
        position: 0,
        name,
        batterPower: 10000,
        pitcherPower: 10000
      }
      const {weeklyRecord} = await this.portService.addRowMember(jwtPayload, data)

      const {weekOId: _weekOId, rowInfo} = weeklyRecord
      if (_weekOId !== this.weekOId) throw `왜 weekOId 가 다르지...????`
      if (rowInfo.membersInfo.length === 0) throw `왜 멤버가 안 들어갔지?`
      if (rowInfo.membersInfo.length > 1) throw `왜 멤버가 더 들어갔지?`
      if (rowInfo.membersInfo[0].name !== name) throw `왜 다른 이름이 들어갔지?`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _createSecond(db: Db, logLevel: number) {
    try {
      const {jwtPayload, name: _name, weekOId} = this

      const name = _name + 2

      const data1: AddRowMemberDataType = {
        weekOId: weekOId,
        position: 0,
        name,
        batterPower: 9000,
        pitcherPower: 9000
      }
      const {weeklyRecord} = await this.portService.addRowMember(jwtPayload, data1)

      const {weekOId: _weekOId, rowInfo} = weeklyRecord
      if (_weekOId !== this.weekOId) throw `왜 weekOId 가 다르지...????`
      if (rowInfo.membersInfo.length < 2) throw `왜 멤버가 안 들어갔지?`
      if (rowInfo.membersInfo.length > 2) throw `왜 멤버가 더 들어갔지?`
      if (rowInfo.membersInfo[1].name !== name) throw `왜 다른 이름이 들어갔지?`
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
  const testModule = new AddMultiple(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
