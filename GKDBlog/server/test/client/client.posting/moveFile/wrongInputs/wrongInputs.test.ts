/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {AUTH_ADMIN} from '@common/secret'
import {AddFileDataType, JwtPayloadType, MoveFileDataType} from '@common/types'
import {ClientPortServiceTest} from '@modules/index'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 입력값 자체가 이상한 경우를 테스트한다.
 * - 여러 케이스들에 대해 서브테스트를 검증한다.
 * - testOK 로 실행한다.
 *
 * 테스트 준비
 * - 루트 디렉토리에 파일 하나 추가
 *
 * 에러 케이스
 * 1. moveFileOId 가 입력 안 된 경우
 * 2. parentDirOId 가 입력 안 된 경우
 * 3. targetIdx 가 undefined 인 경우
 *
 * 테스트 제외
 * - 파일 이름이 중복된 경우
 *   + 부모 바꿀때 테스트에서 점검한다.
 * - 지워진 디렉토리로 옮기려는 경우
 *   + 부모 바꿀때 테스트에서 점검한다.
 *
 */
export class WrongInputs extends GKDTestBase {
  private portService = new ClientPortServiceTest().clientPortService
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

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_try_moveFileOId_is_empty.bind(this), db, logLevel)
      await this.memberFail(this._2_try_parentDirOId_is_empty.bind(this), db, logLevel)
      await this.memberFail(this._3_try_targetIdx_is_undefined.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name})
      await this.testDB.resetBaseDB()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_try_moveFileOId_is_empty(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userOId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {userId, userOId, userName, signUpType}

      const {directory: rootDir} = this.testDB.getRootDir()
      const rootDirOId = rootDir.dirOId

      const moveFileOId = ''
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

  private async _2_try_parentDirOId_is_empty(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userOId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {userId, userOId, userName, signUpType}

      const moveFileOId = this.fileOId
      const targetDirOId = ''
      const targetIdx = 0

      const data: MoveFileDataType = {moveFileOId, targetDirOId, targetIdx}

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_try_targetIdx_is_undefined(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userOId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {userId, userOId, userName, signUpType}

      const {directory: rootDir} = this.testDB.getRootDir()
      const rootDirOId = rootDir.dirOId

      const moveFileOId = this.fileOId
      const targetDirOId = rootDirOId
      const targetIdx = undefined

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
  const testModule = new WrongInputs(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
