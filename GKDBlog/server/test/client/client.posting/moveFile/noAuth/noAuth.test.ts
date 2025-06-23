/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/database'
import {AUTH_ADMIN, AUTH_GUEST, AUTH_USER, AUTH_VAL_ARR} from '@common/secret'
import {AddFileDataType, JwtPayloadType, MoveFileDataType} from '@common/types'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 권한이 없는 경우
 * - 여러 권한값에 대해 서브테스트를 수행한다.
 * - testOK 로 실행한다.
 *
 * 테스트 준비
 * - 루트 디렉토리에 파일 하나 추가
 */
export class NoAuth extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private authChecked = {}
  private fileOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userOId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {userId, userOId, userName, signUpType}

      const {directory: rootDir} = this.testDB.getRootDir()
      const rootDirOId = rootDir.dirOId

      const fileName = this.constructor.name
      const parentDirOId = rootDirOId
      const data: AddFileDataType = {fileName, parentDirOId}

      const {extraFileRows} = await this.portService.addFile(jwtPayload, data)
      const {fileOIdsArr, fileRows} = extraFileRows

      const fileOId = fileOIdsArr.filter(fileOId => fileRows[fileOId].name === fileName)[0]
      this.fileOId = fileOId

      /**
       * 다음 두 권한값은 테스트 대상이 아니다.
       * - AUTH_ADMIN: 성공해야 한다.
       * - AUTH_GUEST: 이런 권한값의 유저는 없다.
       */
      this.authChecked[AUTH_ADMIN] = true
      this.authChecked[AUTH_GUEST] = true
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_try_AUTH_USER.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      AUTH_VAL_ARR.forEach(authVal => {
        if (!this.authChecked[authVal]) {
          this.logMessage(`권한값 ${authVal} 에 대해 테스트를 수행하지 않았어요`)
        }
      })
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name})
      await this.testDB.resetBaseDB()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_try_AUTH_USER(db: Db, logLevel: number) {
    try {
      this.authChecked[AUTH_USER] = true

      const {fileOId} = this

      const {user} = this.testDB.getLocalUser(AUTH_USER)
      const {userId, userOId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {userId, userOId, userName, signUpType}

      const {directory: rootDir} = this.testDB.getRootDir()
      const rootDirOId = rootDir.dirOId

      const moveFileOId = fileOId
      const targetDirOId = rootDirOId
      const targetIdx = 0

      const data: MoveFileDataType = {moveFileOId, targetDirOId, targetIdx}

      await this.portService.moveFile(jwtPayload, data)
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
  const testModule = new NoAuth(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
