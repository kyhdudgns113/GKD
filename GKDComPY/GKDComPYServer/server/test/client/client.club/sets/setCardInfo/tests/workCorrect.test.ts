import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {
  AddMemberDataType,
  JwtPayloadType,
  MemberInfoType,
  SetCardInfoDataType
} from '../../../../../../src/common/types'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {Types} from 'mongoose'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 필요로 하는 기능 수행을 제대로 하는지 테스트한다.\
 *   1. 35명의 멤버에 대해서 입력한 정보가 저장되었는지 테스트
 */
export class WorkCorrect extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private jwtPayload: JwtPayloadType
  private membersArr: MemberInfoType[] = []
  private name: string
  private readonly numMembers: number = 35

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const jwtPayload: JwtPayloadType = {id, uOId}

      // 테스트용 클럽 생성
      //   - 데이터 조작후 돌려놓는게 너무 번거롭다.
      const name = this.constructor.name
      const clubRes = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubRes.insertedId.toString()

      const membersArr: MemberInfoType[] = []

      // 테스트용 멤버 35명 생성
      for (let mIdx = 0; mIdx < this.numMembers; mIdx++) {
        const name = `${this.constructor.name}_${mIdx}`
        const batterPower = 0
        const pitcherPower = 0

        const data: AddMemberDataType = {commOId, clubOId, name, batterPower, pitcherPower}
        const {members} = await this.portService.addMemberReqByClub(jwtPayload, data)

        // membersArr 를 차곡차곡 완성한다.
        Object.keys(members).forEach(memOId => {
          if (members[memOId].name === name) {
            membersArr.push(members[memOId])
          }
        })
      }

      this.clubOId = clubOId
      this.jwtPayload = jwtPayload
      this.membersArr = membersArr
      this.name = name
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._test35Member.bind(this), db, logLevel)
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

  /**
   * 35명의 클럽 멤버에 대해서 정보가 제대로 들어왔나 확인한다.
   *   - 해보니까 너무 오래걸려서 5명만 확인한다.
   *
   * @param _this : 이거 안해주면 콜백으로 호출하는 과정에서 this 가 undefined 가 된다
   * @param db
   * @param logLevel
   */
  private async _test35Member(db: Db, logLevel: number) {
    try {
      console.log(`좀 걸려요... 로그레벨:${logLevel}/${DEFAULT_REQUIRED_LOG_LEVEL + 2}`)
      const {clubOId, jwtPayload, membersArr, name, numMembers} = this

      // 멤버별로 카드정보를 바꾼다.
      for (let memIdx = 0; memIdx < numMembers; memIdx += 7) {
        this.logMessage(`${memIdx + 1}/${numMembers} 멤버 카드 수정중...`, 2)
        const {memOId} = this.membersArr[memIdx]

        // 각 포지션의 카드별로 정보를 바꾼다.
        for (let posIdx = 0; posIdx < 25; posIdx++) {
          const name = `${posIdx}`
          const skillIdxs = [0, 1, 2]
          const skillLevels = [0, 0, 0]
          const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}
          await this.portService.setCardInfo(jwtPayload, data)
        }
      }

      const {members} = await this.portService.getMembersByClub(jwtPayload, clubOId)

      // 멤버별로 테스트한다.
      for (let memIdx = 0; memIdx < numMembers; memIdx += 7) {
        this.logMessage(`${memIdx + 1}/${numMembers} 멤버 테스트중...`, 2)
        const {memOId} = membersArr[memIdx]
        const member = members[memOId] // 수정후의 멤버

        // 멤버정보 그대로 들어갔었는지 테스트한다.
        if (member) {
          // 이름 췍!!
          if (member.name !== `${name}_${memIdx}`) {
            this.logMessage(`원래이름:${name}_${memIdx}, 받은이름:${member.name}`)
            throw `${memIdx}번째 멤버 이름 오류`
          }

          // memOId 췍!!
          if (!member.memOId) {
            this.logMessage(`${memIdx} 가 memOId 가 없어요`)
            throw `${memIdx}번째 멤버 OId 오류`
          }
        } // BLANK LINE COMMENT:
        else {
          this.logMessage(`${memIdx}번째 멤버 없음`)
          throw `${memIdx}번째 멤버 없음`
        }

        // 각 포지션의 카드별로 테스트한다.
        for (let posIdx = 0; posIdx < 25; posIdx++) {
          const card = member.deck[posIdx]
          const name = `${posIdx}`
          const skillIdxs = [0, 1, 2]
          const skillLevels = [0, 0, 0]

          // 카드 이름 테스트
          if (card.name !== name) {
            this.logMessage(`${memIdx}멤버 ${posIdx}카드 이름 오류`)
            throw `${name} ${memIdx}멤버 ${posIdx}카드 이름`
          }

          // 카드 스킬 인덱스 테스트
          for (let i = 0; i < 3; i++) {
            if (card.skillIdxs[i] !== skillIdxs[i]) {
              this.logMessage(`${memIdx}멤버 ${posIdx}카드 스킬 오류`)
              throw `${name} ${memIdx}멤버 ${posIdx}카드 스킬`
            }
          }

          // 카드 스킬 레벨 테스트
          for (let i = 0; i < 3; i++) {
            if (card.skillLevels[i] !== skillLevels[i]) {
              this.logMessage(`${memIdx}멤버 ${posIdx}카드 레벨 오류`)
              throw `${name} ${memIdx}멤버 ${posIdx}카드 레벨`
            }
          }
        }
      }
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
