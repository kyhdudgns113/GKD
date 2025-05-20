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
  SetMemberCommentDataType,
  SetMemberPosDataType
} from '../../../../../../src/common/types'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 1. 한 명의 멤버만 존재할때
 * 2. 10명의 멤버가 존재할때
 */
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
      const name = this.constructor.name

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

      const name0 = name + 0

      const memDB = await this.db.collection('members').insertOne({commOId, clubOId, name: name0})
      const memOId = memDB.insertedId.toString()

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
      await this.memberOK(this._onlyOneMember.bind(this), db, logLevel)
      await this.memberOK(this._manyMember.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, name} = this

      // 여러 테스트에서 멤버를 많이 생성한다.
      await this.db.collection('members').deleteMany({clubOId})
      await this.db.collection('clubs').deleteOne({commOId, name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * 클럽에 멤버가 오직 한 명일때 position 값을 여러번 바꿔본다.
   * 0 -> 1 -> 2 -> 1 순으로 한다.
   * 원래는 0 -> 1 -> 2 -> 0 순으로만 온다.
   * 복수의 클라로부터 요청이 꼬일수도 있어서 0 1 2 1 같은것도 되게 한다.
   */
  private async _onlyOneMember(db: Db, logLevel: number) {
    try {
      const {jwtPayload, memOId, name} = this

      let position = 0

      // 0. pos 를 0으로 설정한다.
      position = 0
      const data0: SetMemberPosDataType = {memOId, position}

      const {members: members0} = await this.portService.setMemPos(jwtPayload, data0)
      const ret0 = members0[memOId].position
      if (ret0 !== position) throw `0포지션 값이 ${position} 이 아닌 ${ret0}`

      // 1. pos 를 1로 설정한다.
      position = 1
      const data1: SetMemberPosDataType = {memOId, position}

      const {members: members1} = await this.portService.setMemPos(jwtPayload, data1)
      const ret1 = members1[memOId].position
      if (ret1 !== position) throw `1포지션 값이 ${position} 이 아닌 ${ret1}`

      // 2. pos 를 2로 설정한다.
      position = 2
      const data2: SetMemberPosDataType = {memOId, position}

      const {members: members2} = await this.portService.setMemPos(jwtPayload, data2)
      const ret2 = members2[memOId].position
      if (ret2 !== position) throw `2포지션 값이 ${position} 이 아닌 ${ret2}`

      // 3. pos 를 1로 설정한다.
      position = 1
      const data3: SetMemberPosDataType = {memOId, position}

      const {members: members3} = await this.portService.setMemPos(jwtPayload, data3)
      const ret3 = members3[memOId].position
      if (ret3 !== position) throw `3포지션 값이 ${position} 이 아닌 ${ret3}`

      // 그 와중에 이름 안 바뀌었나 테스트한다.
      const retName = members3[memOId].name
      if (retName !== name + 0) throw `이름이 왜 ${name + 0} 이 아닌 ${retName}`

      // memOId 도 확인해보자
      const retOId = members3[memOId].memOId
      if (retOId !== memOId) throw `memOId 는 왜 ${memOId} 에서 ${retOId} 로 쳐 바뀜?`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 클럽이 총 10명의 멤버로 구성되게 하고 테스트한다.
   * 0번째 멤버의 포지션만 [0, 1, 2, 0] 으로 변경한다.
   */
  private async _manyMember(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, jwtPayload, memOId, name} = this
      let position = 0

      // 멤버를 10명으로 맞추고, 초기 멤버 오브젝트를 가져온다.
      const query = Array(9)
        .fill(null)
        .map((_, idx) => {
          return {clubOId, commOId, name: name + (idx + 1)}
        })

      await this.db.collection('members').insertMany(query)
      const {members: _init} = await this.portService.getMembersByClub(jwtPayload, clubOId)

      // 혹시나 해서 멤버 10명인지 체크해보자
      const _prevLen = Object.keys(_init).length
      if (_prevLen !== 10) throw `아니 젠장 여기서 왜 터지는거야? 길이가 10이 아닌 ${_prevLen}`

      // 1: 0번째 멤버 포지션만 0으로 해보자.
      position = 0
      const data1: SetMemberPosDataType = {memOId, position}
      const {members: mems1} = await this.portService.setMemPos(jwtPayload, data1)

      // 1.1: 포지션 값 바뀌었나 확인
      const pos1 = mems1[memOId].position
      if (pos1 !== position) throw `1_포지션이 0 이어야 하는데 ${pos1} 입니다.`

      // 2: 0번째 멤버 포지션만 1로 해보자.
      position = 1
      const data2: SetMemberPosDataType = {memOId, position}
      const {members: mems2} = await this.portService.setMemPos(jwtPayload, data2)

      // 2.1: 포지션 값 바뀌었나 확인
      const pos2 = mems2[memOId].position
      if (pos2 !== position) throw `2_포지션이 1 이어야 하는데 ${pos2} 입니다.`

      // 2.2: 나머지 애들은 포지션이 그대로 0(default)인가 확인
      const keysArr2 = Object.keys(mems2)
      keysArr2.forEach((_memOId, _idx) => {
        const member = mems2[_memOId]
        if (memOId !== _memOId && member.position !== 0)
          throw `2_${member.name}의 포지션이 1이 아닌 ${member.position}`
      })

      // 3: 0번째 멤버 포지션만 2로 해보자.
      position = 2
      const data3: SetMemberPosDataType = {memOId, position}
      const {members: mems3} = await this.portService.setMemPos(jwtPayload, data3)

      // 3.1: 포지션 값 바뀌었나 확인
      const pos3 = mems3[memOId].position
      if (pos3 !== position) throw `3_포지션이 2 이어야 하는데 ${pos3} 입니다.`

      // 3.2: 나머지 애들은 포지션이 그대로 0(default)인가 확인
      const keysArr3 = Object.keys(mems3)
      keysArr3.forEach((_memOId, _idx) => {
        const member = mems3[_memOId]
        if (memOId !== _memOId && member.position !== 0)
          throw `3_${member.name}의 포지션이 2가 아닌 ${member.position}`
      })

      // 4: 0번째 멤버 포지션만 0으로 해보자.
      position = 0
      const data4: SetMemberPosDataType = {memOId, position}
      const {members: mems4} = await this.portService.setMemPos(jwtPayload, data4)

      // 4.1: 포지션 값 바뀌었나 확인
      const pos4 = mems4[memOId].position
      if (pos4 !== position) throw `4_포지션이 0 이어야 하는데 ${pos4} 입니다.`

      // 4.2: 나머지 애들은 포지션이 그대로 0(default)인가 확인
      const keysArr4 = Object.keys(mems3)
      keysArr4.forEach((_memOId, _idx) => {
        const member = mems4[_memOId]
        if (memOId !== _memOId && member.position !== 0)
          throw `4_${member.name}의 포지션이 0이 아닌 ${member.position}`
      })

      // 0번째 멤버의 이름이나 memOId 가 바뀌진 않았을거다.
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
