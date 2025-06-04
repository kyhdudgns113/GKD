/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/database'
/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * signUp 에서 잘못된 입력에 대한 테스트
 * 1. 너무 짧은 아이디
 * 2. 너무 긴 아이디
 * 3. 너무 짧은 비밀번호
 * 4. 너무 긴 비밀번호
 * 5. 잘못된 비밀번호 형식
 *   - 소문자 없음
 *   - 대문자 없음
 *   - 숫자 없음
 *   - 특수문자 없음
 *
 * 안하는것
 * - 아이디 중복
 * - 이름 중복
 */
export class WrongInput extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._shortUserId.bind(this), db, logLevel)
      await this.memberFail(this._longUserId.bind(this), db, logLevel)
      await this.memberFail(this._shortPassword.bind(this), db, logLevel)
      await this.memberFail(this._longPassword.bind(this), db, logLevel)
      await this.memberFail(this._passwordNoLower.bind(this), db, logLevel)
      await this.memberFail(this._passwordNoUpper.bind(this), db, logLevel)
      await this.memberFail(this._passwordNoNumber.bind(this), db, logLevel)
      await this.memberFail(this._passwordNoSpecialChar.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('userdbs').deleteOne({userId: 'useId'})
      await this.db.collection('userdbs').deleteOne({userId: 'userId'})
      await this.db.collection('userdbs').deleteOne({userId: 'userId'.repeat(5)})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _shortUserId(db: Db, logLevel: number) {
    try {
      const userId = `useId`
      const userName = `userName`
      const password = `testPassword1!`

      const {user} = await this.portService.signUp(userId, userName, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _longUserId(db: Db, logLevel: number) {
    try {
      const userId = `userId`.repeat(5)
      const userName = `userName`
      const password = `testPassword1!`

      const {user} = await this.portService.signUp(userId, userName, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _shortPassword(db: Db, logLevel: number) {
    try {
      const userId = `userId`
      const userName = `userName`
      const password = `aA1!`

      const {user} = await this.portService.signUp(userId, userName, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _longPassword(db: Db, logLevel: number) {
    try {
      const userId = `userId`
      const userName = `userName`
      const password = `aA1!`.repeat(10)

      const {user} = await this.portService.signUp(userId, userName, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _passwordNoLower(db: Db, logLevel: number) {
    try {
      const userId = `userId`
      const userName = `userName`
      const password = `A12345678!`

      const {user} = await this.portService.signUp(userId, userName, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _passwordNoUpper(db: Db, logLevel: number) {
    try {
      const userId = `userId`
      const userName = `userName`
      const password = `a12345678!`

      const {user} = await this.portService.signUp(userId, userName, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _passwordNoNumber(db: Db, logLevel: number) {
    try {
      const userId = `userId`
      const userName = `userName`
      const password = `Abcdefg!`

      const {user} = await this.portService.signUp(userId, userName, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _passwordNoSpecialChar(db: Db, logLevel: number) {
    try {
      const userId = `userId`
      const userName = `userName`
      const password = `aBcdefg1234567890`

      const {user} = await this.portService.signUp(userId, userName, password)
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
  const testModule = new WrongInput(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
