/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/database'
import {AddFileDataType, JwtPayloadType} from '@common/types'
import {AUTH_ADMIN} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 잘못된 입력에 대한 테스트
 * - 하위 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 1. 존재하지 않는 폴더에 생성 시도
 * 2. parentDirOId 를 "NULL" 로 생성 시도
 * 3. 이름 길이 2 미만으로 시도
 * 4. 이름 길이 40 초과로 시도
 */
export class WrongInputs extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType
  private shortName = 'a'
  private longName = 'a'.repeat(41)

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userName, signUpType, userOId} = user
      this.jwtPayload = {userId, userName, signUpType, userOId}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_create_in_nonexistent_dir.bind(this), db, logLevel)
      await this.memberFail(this._2_create_in_null_parentDirOId.bind(this), db, logLevel)
      await this.memberFail(this._3_create_with_short_name.bind(this), db, logLevel)
      await this.memberFail(this._4_create_with_long_name.bind(this), db, logLevel)
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name})
      await this.db.collection('filedbs').deleteOne({name: this.shortName})
      await this.db.collection('filedbs').deleteOne({name: this.longName})

      await this.testDB.resetBaseDB()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_create_in_nonexistent_dir(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const fileName = this.constructor.name
      const parentDirOId = '123456781234567812345678'

      const data: AddFileDataType = {fileName, parentDirOId}
      await this.portService.addFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _2_create_in_null_parentDirOId(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const fileName = this.constructor.name
      const parentDirOId = 'NULL'

      const data: AddFileDataType = {fileName, parentDirOId}
      await this.portService.addFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _3_create_with_short_name(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const fileName = this.shortName
      const parentDirOId = this.testDB.getRootDir().directory.dirOId

      const data: AddFileDataType = {fileName, parentDirOId}
      await this.portService.addFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _4_create_with_long_name(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this
      const fileName = this.longName
      const parentDirOId = this.testDB.getRootDir().directory.dirOId

      const data: AddFileDataType = {fileName, parentDirOId}
      await this.portService.addFile(jwtPayload, data)
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
  const testModule = new WrongInputs(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
