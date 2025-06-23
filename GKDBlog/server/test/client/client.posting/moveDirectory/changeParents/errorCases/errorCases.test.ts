/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/database'
import {AddDirectoryDataType, DirectoryType, JwtPayloadType, MoveDirectoryDataType} from '@common/types'
import {AUTH_ADMIN} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 5

/**
 * moveDirectory 에서 다른 부모로 옮길때 에러케이스들을 테스트한다.
 * - 서브 테스트를 점검하므로 testOK 로 실행한다.
 *
 * 테스트 준비(루트에 새로 디렉토리 생성)
 * - TempRoot
 *   - Dir_0
 *     - Dir_0_0 (자손 폴더 이동 테스트용)
 *   - Dir_1
 *     - Dir_0 (중복 테스트용)
 *
 * 에러 케이스
 * - Error 1. 옮기려는 폴더에 이름이 중복되는 경우
 * - Error 2. 자손 폴더로 이동하려는 경우
 *
 * - 제외 1. 삭제된 폴더로 이동하려는 경우(WrongInputs 에서 함)
 */
export class ErrorCases extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType
  private dirOId_tempRoot: string
  private dirOId_0: string
  private dirOId_0_0: string
  private dirOId_1: string
  private dirOId_1_child: string
  private dir_tempRoot: DirectoryType

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    /**
     * 1. 루트 폴더에 TempRoot 폴더를 생성
     * 2. TempRoot 에 자식 폴더 2개 생성
     * 3. 각 폴더에 자식 폴더 1개씩 생성
     */
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userOId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {
        userId,
        userOId,
        userName,
        signUpType
      }
      this.jwtPayload = jwtPayload

      const {directory: rootDir} = this.testDB.getRootDir()
      const rootDirOId = rootDir.dirOId

      // 1. 루트 폴더에 TempRoot 폴더를 생성
      const dataDirTempRoot: AddDirectoryDataType = {
        dirName: this.constructor.name,
        parentDirOId: rootDirOId
      }
      const {extraDirs: extraDirsTempRoot} = await this.portService.addDirectory(jwtPayload, dataDirTempRoot)
      const {dirOIdsArr: rootsArr, directories: rootsDirs} = extraDirsTempRoot
      this.dirOId_tempRoot = rootsArr.filter(dirOId => rootsDirs[dirOId].dirName === this.constructor.name)[0]

      // 2. TempRoot 에 자식 폴더 2개 생성
      const dataTemp0: AddDirectoryDataType = {
        dirName: this.constructor.name + '_0',
        parentDirOId: this.dirOId_tempRoot
      }
      const dataTemp1: AddDirectoryDataType = {
        dirName: this.constructor.name + '_1',
        parentDirOId: this.dirOId_tempRoot
      }
      await this.portService.addDirectory(jwtPayload, dataTemp0)
      const {extraDirs: extraDirsTemp} = await this.portService.addDirectory(jwtPayload, dataTemp1)

      this.dir_tempRoot = rootsDirs[this.dirOId_tempRoot]

      const dirOId_0 = extraDirsTemp.dirOIdsArr[1]
      const dirOId_1 = extraDirsTemp.dirOIdsArr[2]

      this.dirOId_0 = dirOId_0
      this.dirOId_1 = dirOId_1

      // 3. 각 폴더에 자식 폴더 1개씩 생성
      const dataDir0: AddDirectoryDataType = {
        dirName: this.constructor.name + '_0_0',
        parentDirOId: dirOId_0
      }
      const dataDir1: AddDirectoryDataType = {
        dirName: this.constructor.name + '_0',
        parentDirOId: dirOId_1
      }
      const {extraDirs: extraDirsDir0} = await this.portService.addDirectory(jwtPayload, dataDir0)
      const {dirOIdsArr: dir0Arr, directories: dir0Dirs} = extraDirsDir0
      this.dirOId_0_0 = dir0Arr.filter(dirOId => dir0Dirs[dirOId].dirName === this.constructor.name + '_0_0')[0]

      const {extraDirs: extraDirsDir1} = await this.portService.addDirectory(jwtPayload, dataDir1)
      const {dirOIdsArr: dir1Arr, directories: dir1Dirs} = extraDirsDir1
      this.dirOId_1_child = dir1Arr.filter(dirOId => dir1Dirs[dirOId].dirName === this.constructor.name + '_0')[0]
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_try_go_to_child.bind(this), db, logLevel)
      await this.memberFail(this._2_try_duplicate_name.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    /**
     * 여기서 baseDB 리셋해도 상관 없다.
     * - 어차피 상위 모듈에서도 baseDB 자체를 쓰지는 않는다.
     */
    try {
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name})
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_0'})
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_1'})
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_0_0'})
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_0'})

      await this.testDB.resetBaseDB()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_try_go_to_child(db: Db, logLevel: number) {
    try {
      const {dirOId_0, dirOId_0_0, jwtPayload} = this
      const data: MoveDirectoryDataType = {
        moveDirOId: dirOId_0,
        parentDirOId: dirOId_0_0,
        targetIdx: 0
      }
      await this.portService.moveDirectory(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_try_duplicate_name(db: Db, logLevel: number) {
    try {
      const {dirOId_0, dirOId_1, jwtPayload} = this
      const data: MoveDirectoryDataType = {
        moveDirOId: dirOId_0,
        parentDirOId: dirOId_1,
        targetIdx: 0
      }
      await this.portService.moveDirectory(jwtPayload, data)
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
  const testModule = new ErrorCases(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
