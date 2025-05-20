import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {JwtPayloadType} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class WorkCorrect extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private name: string // 클럽의 이름이다

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name

      const clubRes = await this.db.collection('clubs').insertOne({name, commOId})

      this.clubOId = clubRes.insertedId.toString()
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
      await this.memberOK(this._readOnlyOne.bind(this), db, logLevel)
      await this.memberOK(this._readMoreMember.bind(this), db, logLevel)
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

  private async _readOnlyOne(db: Db, logLevel: number) {
    try {
      const {commOId, clubOId, jwtPayload, name: _name} = this

      // _readMoreMember 와의 호환성 때문에 0을 붙여준다.
      const name = _name + 0
      const memRes = await this.db.collection('members').insertOne({commOId, clubOId, name})
      const memOId = memRes.insertedId.toString()

      const {members} = await this.portService.getMembersByClub(jwtPayload, clubOId)

      if (Object.keys(members).length !== 1) throw '출력되는 멤버 수가 잘못됬습니다.'
      if (members[memOId].memOId !== memOId) throw `왜 멤버 정보가 다를까요?`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _readMoreMember(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, name, jwtPayload} = this

      // 멤버 10명의 이름을 구한다.
      const names = Array(10)
        .fill(null)
        .map((_, idx) => name + idx)

      // 1~9 번째 멤버만 쿼리로 넣는다. 0번째는 이미 들어가있다.
      const queries = Array(9)
        .fill(null)
        .map((_, idx) => {
          return {commOId, clubOId, name: names[idx + 1]}
        })
      await this.db.collection('members').insertMany(queries)

      const {members} = await this.portService.getMembersByClub(jwtPayload, clubOId)

      if (Object.keys(members).length !== names.length) throw '출력되는 멤버 수가 잘못됬습니다.'

      const filtered = Object.keys(members).filter(memOId => !names.includes(members[memOId].name))
      if (filtered.length > 0) throw `안 넣은게 들어가 있다고???`
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
  const testModule = new WorkCorrect(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
