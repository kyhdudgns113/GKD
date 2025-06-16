/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/database'
import {AddDirectoryDataType, AddFileDataType, DirectoryType, JwtPayloadType, MoveFileDataType} from '@common/types'
import {AUTH_ADMIN} from '@common/secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 5

/**
 * moveFiles 에서 부모가 바뀌는 경우의 에러 케이스를 점검한다.
 * - 여러 서브테스트를 점검한다.
 * - testOK 로 실행한다.
 *
 * 테스트 준비
 * - 루트 폴더에 부모 폴더를 만든다.
 * - 부모 폴더에 자식 폴더를 3개 만든다.
 * - 부모 폴더에 파일을 1개 만든다.
 * - 각 자식폴더마다 파일을 1개씩 만든다.
 *
 * 서브 테스트
 * - 파일 이름이 중복된 경우
 * - 이미 지워진 디렉토리로 이동하려는 경우
 * - 파일이 이미 지워진 경우
 */
export class ErrorCases extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType

  private fileOId: string
  private parentDir: DirectoryType
  private parentDirOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userName, userOId, signUpType} = user
      const jwtPayload: JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }
      this.jwtPayload = jwtPayload

      // 1. 루트 폴더에 부모 폴더를 만든다.
      const {directory: rootDir} = this.testDB.getRootDir()

      const rootDirOId = rootDir.dirOId
      const dirName = this.constructor.name

      const dataRoot: AddDirectoryDataType = {dirName, parentDirOId: rootDirOId}
      const {extraDirs: extraDirsRoot, extraFileRows: extraFileRowsRoot} = await this.portService.addDirectory(jwtPayload, dataRoot)

      const {dirOIdsArr: rootsArr, directories: rootsDirs} = extraDirsRoot

      const parentDirOId = rootsArr.filter(dirOId => rootsDirs[dirOId].dirName === dirName)[0]
      this.parentDirOId = parentDirOId

      // 2. 부모 폴더에 자식 폴더를 3개 만든다.
      for (let i = 0; i < 3; i++) {
        const dirName = this.constructor.name + `_${i}`
        const data: AddDirectoryDataType = {dirName, parentDirOId}
        await this.portService.addDirectory(jwtPayload, data)
      }

      // 3. 부모 폴더에 파일을 1개 만든다.
      const fileName = this.constructor.name + `_0_0` // 자식의 파일이랑 이름이 겹치게 한다.
      const dataFile: AddFileDataType = {fileName, parentDirOId}
      const {extraDirs, extraFileRows} = await this.portService.addFile(jwtPayload, dataFile)

      this.fileOId = extraFileRows.fileOIdsArr[0]
      this.parentDir = extraDirs.directories[parentDirOId]

      // 4. 각 자식폴더마다 파일을 1개씩 만든다.
      for (let i = 0; i < 3; i++) {
        const fileName = this.constructor.name + `_${i}_0`
        const parentDirOId = this.parentDir.subDirOIdsArr[i]
        const data: AddFileDataType = {fileName, parentDirOId}
        await this.portService.addFile(jwtPayload, data)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_try_duplicate.bind(this), db, logLevel)
      await this.memberFail(this._2_try_already_deleted_dir.bind(this), db, logLevel)
      await this.memberFail(this._3_try_already_deleted_file.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('filedbs').deleteMany({name: this.constructor.name + '_0_0'}) // 얘는 2개 만들었다
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name + '_1_0'})
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name + '_2_0'})

      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_0'})
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_1'})
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_2'})

      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name})

      await this.testDB.resetBaseDB()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_try_duplicate(db: Db, logLevel: number) {
    try {
      const {fileOId, jwtPayload, parentDir} = this

      const moveFileOId = fileOId
      const targetDirOId = parentDir.subDirOIdsArr[0]
      const targetIdx = 0

      const data: MoveFileDataType = {moveFileOId, targetDirOId, targetIdx}

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_try_already_deleted_dir(db: Db, logLevel: number) {
    try {
      const {fileOId, jwtPayload, parentDir} = this

      const moveFileOId = fileOId
      const targetDirOId = parentDir.subDirOIdsArr[0]
      const targetIdx = 0

      await this.portService.deleteDirectory(jwtPayload, targetDirOId)

      const data: MoveFileDataType = {moveFileOId, targetDirOId, targetIdx}

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_try_already_deleted_file(db: Db, logLevel: number) {
    try {
      const {fileOId, jwtPayload, parentDir} = this

      const moveFileOId = fileOId
      const targetDirOId = parentDir.subDirOIdsArr[1]
      const targetIdx = 0

      await this.portService.deleteFile(jwtPayload, fileOId)

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
  const testModule = new ErrorCases(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
