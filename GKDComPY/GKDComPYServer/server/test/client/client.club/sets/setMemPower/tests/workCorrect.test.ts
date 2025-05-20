/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {JwtPayloadType, SetMemberPowerDataType} from '../../../../../../src/common/types'
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
  private memOId: string
  private name: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const jwtPayload: JwtPayloadType = {id, uOId}
      const nameBase = this.constructor.name
      let name = nameBase

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

      name = name + 0
      const memDB = await this.db.collection('members').insertOne({commOId, clubOId, name})
      const memOId = memDB.insertedId.toString()

      this.clubOId = clubOId
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.memOId = memOId
      this.name = nameBase
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._OnlyOneMember.bind(this), db, logLevel)
      await this.memberOK(this._ManyMember.bind(this), db, logLevel)
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

  private async _OnlyOneMember(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOId, name} = this
      const [batterPower, pitcherPower] = [1000, 1000]
      const data: SetMemberPowerDataType = {memOId, name, batterPower, pitcherPower}

      // 이름을 name + 0 이 아닌 name 으로 설정을 해버린다.
      const {members} = await this.portService.setMemPowerByClubMember(jwtPayload, data)

      // 멤버 하나만 있나 확인
      const numMem = Object.keys(members).length
      if (numMem !== 1) throw `멤버가 1명이 아닌 ${numMem}명임`

      const member = members[memOId]
      if (!member) throw `멤버가 왜 없지`
      if (member.name !== name) throw `이름이 ${name} 이 아닌 ${member.name}`
      if (member.memOId !== memOId) throw `memOId가 ${memOId} 가 아닌 ${member.memOId}`
      if (member.batterPower !== batterPower)
        throw `batterPower 가 ${batterPower} -> ${member.batterPower}`
      if (member.pitcherPower !== pitcherPower)
        throw `pitcherPower 가 ${pitcherPower} -> ${member.pitcherPower}`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _ManyMember(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, jwtPayload, memOId, name} = this
      let [batterPower, pitcherPower] = [2000, 2000]

      // 멤버를 10명으로 맞추고, 초기 멤버 오브젝트를 가져온다.
      const query = Array(9)
        .fill(null)
        .map((_, idx) => {
          return {clubOId, commOId, batterPower: 0, pitcherPower: 0, name: name + (idx + 1)}
        })
      await this.db.collection('members').insertMany(query)
      const {members: _init} = await this.portService.getMembersByClub(jwtPayload, clubOId)

      // 2번째로 정보 바꿀 멤버의 memOId 를 가져온다.
      const memOId2 = Object.keys(_init).filter(_memOId => _memOId !== memOId)[0]

      // 0. 0번째 멤버를 바꾼다.
      // 이름을 name + 0 이 아닌 name 으로 설정을 해버린다.
      const data0: SetMemberPowerDataType = {memOId, name, batterPower, pitcherPower}
      const {members: members0} = await this.portService.setMemPowerByClubMember(jwtPayload, data0)

      // 0.1. 멤버 10명 있나 확인
      const numMem0 = Object.keys(members0).length
      if (numMem0 !== 10) throw `0. 멤버가 10명이 아닌 ${numMem0}명임`

      const member0 = members0[memOId]
      if (!member0) throw `0. 멤버가 왜 없지`
      if (member0.name !== name) throw `0. 이름이 ${name} 이 아닌 ${member0.name}`
      if (member0.memOId !== memOId) throw `0. memOId가 ${memOId} 가 아닌 ${member0.memOId}`
      if (member0.batterPower !== batterPower)
        throw `0. batterPower 가 ${batterPower} -> ${member0.batterPower}`
      if (member0.pitcherPower !== pitcherPower)
        throw `0. pitcherPower 가 ${pitcherPower} -> ${member0.pitcherPower}`

      // 0.2 다른 멤버가 바뀌었나 확인
      Object.keys(members0).forEach((_memOId, mIdx) => {
        if (memOId === _memOId) return
        const memAft = members0[_memOId]
        const memPre = _init[_memOId]

        if (memAft.name !== memPre.name) throw `0. ${memPre.name} 이름이 ${memAft.name} 으로 바뀜`
        if (memAft.batterPower !== memPre.batterPower)
          throw `0. ${memPre.batterPower} batterPower 가 ${memAft.batterPower} 으로 바뀜`
        if (memAft.pitcherPower !== memPre.pitcherPower)
          throw `0. ${memPre.pitcherPower} pitcherPower 가 ${memAft.pitcherPower} 으로 바뀜`
      })

      // 1. 다른 멤버를 바꾼다.
      const data1: SetMemberPowerDataType = {memOId: memOId2, name: `t`, batterPower, pitcherPower}
      const {members: members1} = await this.portService.setMemPowerByClubMember(jwtPayload, data1)

      // 1.1. 멤버 10명 있나 확인
      const numMem1 = Object.keys(members1).length
      if (numMem1 !== 10) throw `1. 멤버가 10명이 아닌 ${numMem1}명임`

      const member1 = members1[memOId]
      if (!member1) throw `1. 멤버가 왜 없지`
      if (member1.name !== name) throw `1. 이름이 ${name} 이 아닌 ${member1.name}`
      if (member1.memOId !== memOId) throw `1. memOId가 ${memOId} 가 아닌 ${member1.memOId}`
      if (member1.batterPower !== batterPower)
        throw `1. batterPower 가 ${batterPower} -> ${member0.batterPower}`
      if (member1.pitcherPower !== pitcherPower)
        throw `1. pitcherPower 가 ${pitcherPower} -> ${member0.pitcherPower}`

      // 1.2 다른 멤버가 바뀌었나 확인
      Object.keys(members1).forEach((_memOId, mIdx) => {
        if (_memOId === memOId || _memOId === memOId2) return
        const memAft = members1[_memOId]
        const memPre = _init[_memOId]

        if (memAft.name !== memPre.name) throw `1. ${memPre.name} 이름이 ${memAft.name} 으로 바뀜`
        if (memAft.batterPower !== memPre.batterPower)
          throw `1. ${memPre.batterPower} batterPower 가 ${memAft.batterPower} 으로 바뀜`
        if (memAft.pitcherPower !== memPre.pitcherPower)
          throw `1. ${memPre.pitcherPower} pitcherPower 가 ${memAft.pitcherPower} 으로 바뀜`
      })
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
