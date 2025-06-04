/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {ClientPortServiceTest} from '../../../../../src/modules'
import {AddFileDataType, JwtPayloadType} from '../../../../../src/common/types'
import {AUTH_ADMIN} from '../../../../../src/common/secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 잘못된 입력에 대한 테스트
 * - 각 케이스마다 서브 테스트를 통과해야 한다.
 * - 따라서 TestOK 로 실행해야 한다.
 *
 * 서브 테스트
 * 1. 빈 fileOId
 * 2. 아무것도 아닌 fileOId
 * 3. 이미 삭제된 파일의 OId
 */
export class WrongInputs extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userOId, userId, userName, signUpType} = user
      this.jwtPayload = {
        userOId,
        userId,
        userName,
        signUpType
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_try_emptyFileOId.bind(this), db, logLevel)
      await this.memberFail(this._2_try_nothingFileOId.bind(this), db, logLevel)
      await this.memberFail(this._3_try_delete_again.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {dirOId: parentDirOId} = this.testDB.getRootDir().directory
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name, parentDirOId})
      await this.testDB.resetBaseDB()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_try_emptyFileOId() {
    try {
      const fileOId = ''
      await this.portService.deleteFile(this.jwtPayload, fileOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  private async _2_try_nothingFileOId() {
    try {
      const fileOId = '12345678'.repeat(3)
      await this.portService.deleteFile(this.jwtPayload, fileOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  private async _3_try_delete_again() {
    /**
     * 이미 존재하는 파일을 두 번 삭제하려할때 발생하는 에러 테스트
     * - 삭제 한 번은 정상적으로 이루어져야 한다.
     *
     * 정상적으로 실행되어야 할 곳에 에러가 뜨면 바로 return 해버린다.
     * - 그러면 테스트 실패로 간주된다.
     *
     * 진행
     * 1. 삭제할 파일을 루트에 생성한다.
     *   - 이건 실패해선 안된다.
     * 2. 일단 한 번 삭제한다.
     *   - 이건 실패해선 안된다.
     * 3. 다시 삭제한다.
     *   - 이건 실패해야 한다.
     */
    try {
      const {jwtPayload} = this
      const {directory: rootDir} = this.testDB.getRootDir()
      const fileName = this.constructor.name

      // 1. 삭제할 파일을 루트에 생성한다.
      const data: AddFileDataType = {fileName, parentDirOId: rootDir.dirOId}
      let result: any = null
      try {
        result = await this.portService.addFile(jwtPayload, data)
        // BLANK LINE COMMENT:
      } catch (errObj) {
        // BLANK LINE COMMENT:
        this.logMessage(`1. 왜 addFile 에서 에러가 뜨는거지?`, 0)
        this.logMessage(`errObj: ${JSON.stringify(errObj)}`, 0)
        return
      }

      // 2. 일단 한 번 삭제한다.
      const {extraFileRows} = result
      const {fileOIdsArr, fileRows} = extraFileRows
      const fileOId = fileOIdsArr.filter((fileOId: string) => fileRows[fileOId].name === fileName)[0]

      try {
        await this.portService.deleteFile(jwtPayload, fileOId)
        // BLANK LINE COMMENT:
      } catch (errObj) {
        // BLANK LINE COMMENT:
        this.logMessage(`2. 왜 여기서 삭제할때 에러가 뜨는거지?`, 0)
        this.logMessage(`errObj: ${errObj}`, 0)
        return
      }

      // 3. 다시 삭제한다.
      await this.portService.deleteFile(jwtPayload, fileOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WrongInputs(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
