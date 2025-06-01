/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {ClientPortServiceTest} from '../../../../../src/modules/database'
import {AUTH_ADMIN, AUTH_USER} from '../../../../../src/common/secret'
/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class WorkCompleted extends GKDTestBase {
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
      await this.memberOK(this._logInAdminUser.bind(this), db, logLevel)
      await this.memberOK(this._logInNormalUser.bind(this), db, logLevel)
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

  private async _logInAdminUser(db: Db, logLevel: number) {
    try {
      const {user: argUser} = this.testDB.getLocalUser(AUTH_ADMIN)
      const argPassword = `testPassword${AUTH_ADMIN}!`

      const {user} = await this.portService.logIn(argUser.userId, argPassword)

      if (user.userId !== argUser.userId) throw `userId 가 달라요 ${argUser.userId} !== ${user.userId}`
      if (user.userName !== argUser.userName) throw `userName 이 달라요 ${argUser.userName} !== ${user.userName}`
      if (user.userAuth !== argUser.userAuth) throw `userAuth 가 달라요 ${argUser.userAuth} !== ${user.userAuth}`
      if (user.userOId !== argUser.userOId) throw `userOId 가 달라요 ${argUser.userOId} !== ${user.userOId}`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _logInNormalUser(db: Db, logLevel: number) {
    try {
      const {user: argUser} = this.testDB.getLocalUser(AUTH_USER)
      const argPassword = `testPassword${AUTH_USER}!`

      const {user} = await this.portService.logIn(argUser.userId, argPassword)

      if (user.userId !== argUser.userId) throw `userId 가 달라요 ${argUser.userId} !== ${user.userId}`
      if (user.userName !== argUser.userName) throw `userName 이 달라요 ${argUser.userName} !== ${user.userName}`
      if (user.userAuth !== argUser.userAuth) throw `userAuth 가 달라요 ${argUser.userAuth} !== ${user.userAuth}`
      if (user.userOId !== argUser.userOId) throw `userOId 가 달라요 ${argUser.userOId} !== ${user.userOId}`
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
  const testModule = new WorkCompleted(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
