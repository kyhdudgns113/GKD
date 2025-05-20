import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {JwtPayloadType} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class DeleteMember extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private name: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const jwtPayload = {id, uOId}
      const name = this.constructor.name

      const clubRes = await this.db.collection('clubs').insertOne({name, commOId})
      const clubOId = clubRes.insertedId.toString()

      this.clubOId = clubOId
      this.commOId = commOId
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
      await this.memberOK(this._deleteOnlyOne.bind(this), db, logLevel)
      await this.memberOK(this._deleteFromMany.bind(this), db, logLevel)
      await this.memberOK(this._deleteMany.bind(this), db, logLevel)
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
      await this.db.collection('clubs').deleteOne({commOId, name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _deleteOnlyOne(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, jwtPayload, name} = this
      const memRes = await this.db
        .collection('members')
        .insertOne({name: name + 0, commOId, clubOId})
      const memOId = memRes.insertedId.toString()

      const {members} = await this.portService.deleteClubMember(jwtPayload, clubOId, memOId)

      if (Object.keys(members).length !== 0) throw `멤버가 안 지워졌니?`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _deleteFromMany(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, jwtPayload, name} = this
      const queries = Array(20)
        .fill(null)
        .map((_, idx) => {
          return {
            name: name + idx,
            clubOId,
            commOId
          }
        })
      const memRes = await this.db.collection('members').insertMany(queries)
      const memOId = memRes.insertedIds[0].toString()

      const {members} = await this.portService.deleteClubMember(jwtPayload, clubOId, memOId)

      if (Object.keys(members).length !== 19) throw `멤버가 안 지워졌니?`
      if (members[memOId]) throw '얘가 안지워졌니?'
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _deleteMany(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, jwtPayload, name} = this

      const queries = Array(10)
        .fill(null)
        .map((_, idx) => {
          return {
            name: name + 20 + idx,
            clubOId,
            commOId
          }
        })
      const memRes = await this.db.collection('members').insertMany(queries)
      const memOId0 = memRes.insertedIds[0].toString()
      const memOId1 = memRes.insertedIds[1].toString()
      const memOId2 = memRes.insertedIds[2].toString()
      const memOId3 = memRes.insertedIds[3].toString()

      await Promise.all([
        this.portService.deleteClubMember(jwtPayload, clubOId, memOId0),
        this.portService.deleteClubMember(jwtPayload, clubOId, memOId1),
        this.portService.deleteClubMember(jwtPayload, clubOId, memOId2)
      ])
      const {members} = await this.portService.deleteClubMember(jwtPayload, clubOId, memOId3)

      if (Object.keys(members).length !== 25) throw `멤버가 안 지워졌니?`
      if (members[memOId0]) throw '0 이 안지워졌니?'
      if (members[memOId1]) throw '1 이 안지워졌니?'
      if (members[memOId2]) throw '2 가 안지워졌니?'
      if (members[memOId3]) throw '3 이 안지워졌니?'
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
  const testModule = new DeleteMember(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
