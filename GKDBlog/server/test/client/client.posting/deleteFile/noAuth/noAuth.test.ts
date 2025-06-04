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
import {AUTH_ADMIN, AUTH_USER} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 권한 없는 사용자가 파일 삭제 시도 테스트
 * - 각 권한마다 서브 테스트를 통과해야 한다.
 * - 따라서 TestOK 로 실행해야 한다.
 */
export class NoAuth extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private fileOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userOId, userId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {
        userOId,
        userId,
        userName,
        signUpType
      }

      const parentDirOId = this.testDB.getRootDir().directory.dirOId
      const data: AddFileDataType = {
        fileName: this.constructor.name,
        parentDirOId
      }
      const {extraFileRows} = await this.portService.addFile(jwtPayload, data)

      this.fileOId = extraFileRows.fileOIdsArr.filter(fileOId => extraFileRows.fileRows[fileOId].name === this.constructor.name)[0]
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_try_AUTH_USER.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const parentDirOId = this.testDB.getRootDir().directory.dirOId
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name, parentDirOId})
      await this.testDB.resetBaseDB()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_try_AUTH_USER(db: Db, logLevel: number) {
    try {
      const {fileOId} = this

      const {user} = this.testDB.getLocalUser(AUTH_USER)
      const {userOId, userId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {
        userOId,
        userId,
        userName,
        signUpType
      }

      await this.portService.deleteFile(jwtPayload, fileOId)
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
  const testModule = new NoAuth(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
