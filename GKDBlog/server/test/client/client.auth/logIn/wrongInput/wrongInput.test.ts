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
 * 로그인 시 잘못된 입력을 테스트하는 클래스
 * - 하단 테스트들을 전부 통과하면 제대로 작동하는것이다.
 * - 따라서 이 테스트는 OK 로 통과되어야 한다.
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
      await this.memberFail(this._wrongUserId.bind(this), db, logLevel)
      await this.memberFail(this._incorrectPassword.bind(this), db, logLevel)
      await this.memberFail(this._emptyUserId.bind(this), db, logLevel)
      await this.memberFail(this._emptyPassword.bind(this), db, logLevel)
      await this.memberFail(this._shortUserId.bind(this), db, logLevel)
      await this.memberFail(this._longUserId.bind(this), db, logLevel)
      await this.memberFail(this._shortPassword.bind(this), db, logLevel)
      await this.memberFail(this._longPassword.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _wrongUserId(db: Db, logLevel: number) {
    try {
      const userId = 'wrongUserId'
      const password = `passWord1!`
      await this.portService.logIn(userId, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _incorrectPassword(db: Db, logLevel: number) {
    try {
      const userId = 'root'
      const password = 'wrongPassword1!'
      await this.portService.logIn(userId, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _emptyUserId(db: Db, logLevel: number) {
    try {
      const userId = ''
      const password = 'passWord1!'
      await this.portService.logIn(userId, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _emptyPassword(db: Db, logLevel: number) {
    try {
      const userId = 'root'
      const password = ''
      await this.portService.logIn(userId, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _shortUserId(db: Db, logLevel: number) {
    try {
      const userId = 'short'
      const password = 'passWord1!'
      await this.portService.logIn(userId, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _longUserId(db: Db, logLevel: number) {
    try {
      const userId = 'tooLongUserIdLengthOverThe16'
      const password = 'passWord1!'
      await this.portService.logIn(userId, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _shortPassword(db: Db, logLevel: number) {
    try {
      const userId = 'root'
      const password = '1234567'
      await this.portService.logIn(userId, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _longPassword(db: Db, logLevel: number) {
    try {
      const userId = 'root'
      const password = '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
      await this.portService.logIn(userId, password)
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
