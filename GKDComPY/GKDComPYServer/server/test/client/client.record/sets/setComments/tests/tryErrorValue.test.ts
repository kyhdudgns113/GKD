/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortService} from '../../../../../../src/modules/database/ports/clientPort/clientPort.service'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {AddNextWeekDataType, JwtPayloadType, SetCommentDataType} from 'src/common/types'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 여러가지의 에러입력에 대한 테스트를 한다.
 *   - 성공해야 한다.
 *     - 각각의 에러들을 전부 검출하는지를 보기 때문이다.
 */
export class TryErrorValue extends GKDTestBase {
  private portService: ClientPortService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
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

      const name = this.constructor.name
      const jwtPayload: JwtPayloadType = {id, uOId}

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

      const data: AddNextWeekDataType = {clubOId}
      const {weekRowsArr} = await this.portService.addNextWeek(jwtPayload, data)
      const {weekOId} = weekRowsArr[0]

      this.clubOId = clubOId
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.name = name
      this.weekOId = weekOId
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._dayIdxUnder.bind(this), db, logLevel)
      await this.memberFail(this._dayIdxOver.bind(this), db, logLevel)
      await this.memberFail(this._errorWeekOId.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, name} = this
      await this.db.collection('weeklyrecords').deleteOne({clubOId})
      await this.db.collection('clubs').deleteOne({commOId, name})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * dayIdx 가 음수인 경우를 테스트한다.
   */
  private async _dayIdxUnder(db: Db, logLevel: number) {
    try {
      const {jwtPayload, weekOId} = this
      const [dayIdx, comments] = [-1, 'comments']

      const data: SetCommentDataType = {comments, dayIdx, weekOId}
      await this.portService.setComments(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * dayIdx 가 6 인 경우를 테스트한다.
   *   - 월:0, 토:5 이다.
   */
  private async _dayIdxOver(db: Db, logLevel: number) {
    try {
      const {jwtPayload, weekOId} = this
      const [dayIdx, comments] = [6, 'comments']

      const data: SetCommentDataType = {comments, dayIdx, weekOId}
      await this.portService.setComments(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 그냥 이상한 weekOId 가 들어온것만 체크한다.
   * 타 클럽의 weekOId 가 들어오는건 다른곳에서 체크한다.
   */
  private async _errorWeekOId(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const [dayIdx, comments] = [1, 'comments']
      const weekOId = 'NULLWEEKOID'

      const data: SetCommentDataType = {comments, dayIdx, weekOId}
      await this.portService.setComments(jwtPayload, data)
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
  const testModule = new TryErrorValue(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
