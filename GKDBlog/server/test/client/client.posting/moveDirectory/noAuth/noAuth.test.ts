/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/database'
import {AddDirectoryDataType, JwtPayloadType, MoveDirectoryDataType} from '@common/types'
import {AUTH_ADMIN, AUTH_GUEST, AUTH_USER, AUTH_VAL_ARR} from '@common/secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 권한이 없는데 시도하는 경우를 테스트한다.
 *
 * 여러 권한값에 대해 테스트하게 될 수 있다.
 * - testOK 로 실행한다.
 *
 * 다음 권한값에 대해서 테스트한다.
 * - AUTH_USER
 *
 * 다음 권한은 테스트할 필요가 없다.
 * - AUTH_ADMIN
 * - AUTH_GUEST
 *   - 토큰이 발행되지 않는다.
 */
export class NoAuth extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private authChecked = {}
  private dirOId: string
  private rootDirOId: string

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

      const {directory: rootDir} = this.testDB.getRootDir()
      const {dirOId: rootDirOId} = rootDir
      this.rootDirOId = rootDirOId

      const data: AddDirectoryDataType = {
        dirName: this.constructor.name,
        parentDirOId: rootDirOId
      }

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

      const dirOId = extraDirs.dirOIdsArr[2]
      const dir = extraDirs.directories[dirOId]

      if (dir.dirName !== this.constructor.name)
        throw `0. 왜 2번째 인덱스에 새로 만든 디렉토리가 안들어갔지? ${dir.dirName} !== ${this.constructor.name}`

      this.dirOId = dirOId

      // 관리자인 경우는 작동이 잘 되어야 한다 -> 여기서 테스트할 내용은 아니다.
      this.authChecked[AUTH_ADMIN] = true

      // GUEST 인 경우는 토큰이 발행되지 않는다 -> 테스트 대상이 되지 않는다.
      this.authChecked[AUTH_GUEST] = true

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_try_auth_user.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      for (const auth of AUTH_VAL_ARR) {
        if (!this.authChecked[auth]) {
          this.logMessage(`다음 권한이 테스트되지 않았음: ${auth}`)
        }
      }
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name})
      await this.testDB.resetBaseDB()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_try_auth_user(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_USER)
      const {userOId, userId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {
        userOId,
        userId,
        userName,
        signUpType
      }
      const data: MoveDirectoryDataType = {
        moveDirOId: this.dirOId,
        parentDirOId: this.rootDirOId,
        targetIdx: null
      }

      this.authChecked[AUTH_USER] = true

      await this.portService.moveDirectory(jwtPayload, data)
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
