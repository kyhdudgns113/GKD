import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {
  AddMemberDataType,
  JwtPayloadType,
  SetCardInfoDataType
} from '../../../../../../src/common/types'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 스킬 인덱스가 잘못 들어온 모든 경우를 테스트한다.\
 * 각 케이스마다 에러를 throw 하는지 체크한다.\
 * 모든 케이스가 에러를 throw 해야 이 테스트는 통과가 된다.\
 * 이 테스트가 통과하는지 여부를 확인해야 한다.\
 *   => .test(db, logLevel) 로 호출하자.
 */
export class TryErrorSkillIdxs extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType
  private memOId: string // 테스트 멤버 memOId
  private name: string // 테스트 멤버 이름

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {clubOId} = this.testDB.readClub(0, 0).club
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const name = `${this.constructor.name}` // 테스트 멤버 이름

      const jwtPayload: JwtPayloadType = {id, uOId}

      // 테스트용 멤버를 만든다.
      const data: AddMemberDataType = {name, commOId, clubOId, batterPower: 0, pitcherPower: 0}
      const {members} = await this.portService.addMemberReqByClub(jwtPayload, data)
      Object.keys(members).forEach(memOId => {
        if (members[memOId].name === name) {
          this.memOId = memOId
        }
      })
      this.jwtPayload = jwtPayload
      this.name = name
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    /**
     * 아래 멤버 함수중 하나라도 변경에 성공하면 어차피 이 테스트는 실패이다.
     * 어차피 finally 에서 새로 만든 멤버 정보는 지워진다.
     * 멤버 함수에 의해 카드 값이 변경되더라도 신경쓸 필요가 없어진다.
     */
    try {
      await this.memberFail(this._arrLength0.bind(this), db, logLevel)
      await this.memberFail(this._arrLength1.bind(this), db, logLevel)
      await this.memberFail(this._arrLength2.bind(this), db, logLevel)
      await this.memberFail(this._arrLength4.bind(this), db, logLevel)
      await this.memberFail(this._arrLength5.bind(this), db, logLevel)
      await this.memberFail(this._idx0Over.bind(this), db, logLevel)
      await this.memberFail(this._idx0Under.bind(this), db, logLevel)
      await this.memberFail(this._idx1Over.bind(this), db, logLevel)
      await this.memberFail(this._idx1Under.bind(this), db, logLevel)
      await this.memberFail(this._idx2Over.bind(this), db, logLevel)
      await this.memberFail(this._idx2Under.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const name = this.name
      await this.db.collection('members').deleteOne({name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _arrLength0(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = []
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _arrLength1(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [0]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _arrLength2(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [0, 1]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _arrLength4(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [0, 1, 2, 3]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _arrLength5(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [0, 1, 2, 3, 4]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _idx0Over(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [100, 1, 2]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _idx0Under(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [-1, 1, 2]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _idx1Over(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [0, 100, 2]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _idx1Under(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [0, -1, 2]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _idx2Over(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [0, 1, 100]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _idx2Under(db: Db, logLevel: number) {
    try {
      const {memOId, jwtPayload} = this
      const posIdx = 0
      const name = '정민철'
      const skillIdxs = [0, 1, -1]
      const skillLevels = [0, 0, 0]
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}

      await this.portService.setCardInfo(jwtPayload, data)
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
  const testModule = new TryErrorSkillIdxs(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
