/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {
  JwtPayloadType,
  MemberInfoType,
  SetMemberCommentDataType
} from '../../../../../../src/common/types'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class WorkCorrect extends GKDTestBase {
  private portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private memOId0: string
  private name: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const name = this.constructor.name

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

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
      await this.memberOK(this._testOnlyOne.bind(this), db, logLevel)
      await this.memberOK(this._testOneInMany.bind(this), db, logLevel)
      await this.memberOK(this._testMultiple.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {commOId, clubOId, name} = this
      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('clubs').deleteOne({commOId, name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * 클럽에 한 명의 멤버만 있을때, 한 명의 멤버를 바꿈
   */
  private async _testOnlyOne(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload, name} = this

      const mem0 = await this.db.collection('members').insertOne({clubOId, name: name + 0})
      const memOId = mem0.insertedId.toString()
      const memberComment = name + 0

      const data: SetMemberCommentDataType = {clubOId, memOId, memberComment}

      const {members} = await this.portService.setMemComment(jwtPayload, data)

      const numMem = Object.keys(members).length
      if (numMem !== 1) throw `멤버를 1명만 넣었는데 왜 ${numMem}명이 들어가있지?`

      const member = members[memOId]
      if (member.memOId !== memOId)
        throw `memOID 가 왜 다르지 원래:${memOId} vs ${members[memOId].memOId}`
      if (member.memberComment !== memberComment)
        throw `코멘트가 왜 다르지? 원래:${memberComment} vs ${member.memberComment}`
      if (member.name !== name + 0) throw `이름이 왜 다르지? 원래:${name + 0} vs ${member.name}`

      this.memOId0 = memOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 클럽에 여러명의 멤버가 있을때, 한 명의 멤버를 바꿈
   *   - testOnlyOne 의 멤버 1명 + 새로운 멤버 1명이다.
   *   - 새로운 멤버의 코멘트를 바꾼다.
   */
  private async _testOneInMany(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload, memOId0, name} = this

      const mem1 = await this.db.collection('members').insertOne({clubOId, name: name + 1})
      const memOId = mem1.insertedId.toString()
      const memberComment = name + 1

      const data: SetMemberCommentDataType = {clubOId, memOId, memberComment}

      const {members} = await this.portService.setMemComment(jwtPayload, data)

      const numMem = Object.keys(members).length
      if (numMem !== 2) throw `멤버를 2명 넣었는데 왜 ${numMem}명이 들어가있지?`

      const member = members[memOId]
      if (member.memOId !== memOId)
        throw `memOID 가 왜 다르지 원래:${memOId} vs ${members[memOId].memOId}`
      if (member.memberComment !== memberComment)
        throw `코멘트가 왜 다르지? 원래:${memberComment} vs ${member.memberComment}`
      if (member.name !== name + 1) throw `이름이 왜 다르지? 원래:${name + 1} vs ${member.name}`

      // 기존 멤버의 comment 는 바뀌지 않았어야 한다.
      if (members[memOId0].memberComment !== name + 0)
        throw `0번째로 넣었던 멤버의 코멘트가 왜 바뀌지??`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 클럽에 여러명의 멤버가 있을때, 여러명의 멤버를 바꿈
   */
  private async _testMultiple(db: Db, logLevel: number) {
    try {
      const {clubOId, jwtPayload, name} = this

      const query = Array(8)
        .fill(null)
        .map((_, idx) => {
          return {
            clubOId,
            name: name + (2 + idx)
          }
        })

      const memDB = await this.db.collection('members').insertMany(query)
      const memOId = memDB.insertedIds[0].toString()
      const memberComment = name + 2

      const data: SetMemberCommentDataType = {clubOId, memOId, memberComment}

      const {members} = await this.portService.setMemComment(jwtPayload, data)

      const numMem = Object.keys(members).length
      if (numMem !== 10) throw `멤버를 총 10명 넣었는데 왜 ${numMem}명이 있는거지?`

      const member = members[memOId]
      if (member.memOId !== memOId)
        throw `memOID 가 왜 다르지 원래:${memOId} vs ${members[memOId].memOId}`
      if (member.memberComment !== memberComment)
        throw `코멘트가 왜 다르지? 원래:${memberComment} vs ${member.memberComment}`
      if (member.name !== name + 2) throw `이름이 왜 다르지? 원래:${name + 2} vs ${member.name}`

      // 기존 멤버에 대한건 _testOneInMany 에서 테스트 했으므로 생략한다.
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
  const testModule = new WorkCorrect(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
