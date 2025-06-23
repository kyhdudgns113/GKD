/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/database'
import {AUTH_ADMIN, gkdSaltOrRounds} from '@secret'
import bcrypt from 'bcrypt'
import {Types} from 'mongoose'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 회원가입 시 기존에 있는 정보랑 다른 정보를 입력핬을때를 테스트
 * - 중복된 아이디
 * - 중복된 이름
 *
 * 여러 서브 테스트들이 실패하는것을 테스트해야 하므로 이 테스트는 성공해야 한다.
 */
export class WrongInfo extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private userOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const userId = this.constructor.name
      const userName = `testUserName`
      const hashedPassword = await bcrypt.hash(`testPassword1!`, gkdSaltOrRounds)

      const userDB = await this.db.collection('userdbs').insertOne({userId, userName, hashedPassword})

      this.userOId = userDB.insertedId.toString()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._testDuplicateId.bind(this), db, logLevel)
      await this.memberFail(this._testDuplicateName.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {userOId} = this
      const _id = new Types.ObjectId(userOId)
      await this.db.collection('userdbs').deleteOne({_id})
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _testDuplicateId(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const userId = user.userId
      const userName = `testUserName`
      const password = `testPassword1!`
      await this.portService.signUp(userId, userName, password)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  private async _testDuplicateName(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const userId = `testUserId`
      const userName = user.userName
      const password = `testPassword1!`
      await this.portService.signUp(userId, userName, password)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WrongInfo(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
