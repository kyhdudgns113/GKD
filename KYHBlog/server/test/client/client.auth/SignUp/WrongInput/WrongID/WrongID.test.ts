/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommons'

import {AUTH_ADMIN, AUTH_USER} from '@common/secret'

import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataTypes'
import {ClientAuthPortServiceTest} from '@module/database'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 5

/**
 * 잘못된 ID 를 받았을때를 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * ------
 *
 * 서브 테스트
 *   1. ID 확안: 짧은거
 *   2. ID 확안: 긴거
 *   3. ID 확인: 중복
 */
export class WrongID extends GKDTestBase {
  private portService = ClientAuthPortServiceTest.clientAuthPortService

  private userOId: string = null

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Connection, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Connection, logLevel: number) {
    try {
      await this.memberFail(this._1_TryShortID.bind(this), db, logLevel)
      await this.memberFail(this._2_TryLongID.bind(this), db, logLevel)
      await this.memberFail(this._3_TryDuplicateID.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Connection, logLevel: number) {
    try {
      if (this.userOId) {
        const query = `DELETE FROM userdbs WHERE userOId = ?`
        await db.query(query, [this.userOId])
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_TryShortID(db: mysql.Connection, logLevel: number) {
    try {
      const userId = 'abcde'
      const userName = this.constructor.name
      const password = 'testPassword1!'

      const data: HTTP.SignUpDataType = {userId, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _2_TryLongID(db: mysql.Connection, logLevel: number) {
    try {
      const userId = '01234567890123456789a'
      const userName = this.constructor.name
      const password = 'testPassword1!'

      const data: HTTP.SignUpDataType = {userId, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _3_TryDuplicateID(db: mysql.Connection, logLevel: number) {
    try {
      const {user: _user} = this.testDB.getUserCommon(AUTH_USER)

      const userId = _user.userId
      const userName = this.constructor.name
      const password = 'testPassword1!'

      const data: HTTP.SignUpDataType = {userId, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WrongID(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
