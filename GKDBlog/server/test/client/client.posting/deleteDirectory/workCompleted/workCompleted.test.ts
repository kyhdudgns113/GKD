/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {AUTH_ADMIN} from '@secret'
import {ClientPortServiceTest} from '@modules/database'
import {AddDirectoryDataType, AddFileDataType, JwtPayloadType} from '@common/types'
import {Types} from 'mongoose'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 올바른 입력으로 작동을 잘 하는지 확인한다.
 * - 하위 테스트들을 실행하기 때문에 TestOK 로 실행해야 한다.
 *
 * 테스트 세팅을 다음과 같이 한다.
 * - 기존 루트 디렉토리 이름을 잠시 변경한다.
 * - 다음 구조로 디렉토리, 파일을 만든다. (실제 이름은 constructor 뒤에 접미사를 붙여서 만든다.)
 *    - root
 *      - dir_1 (재귀삭제 확인용)
 *        - dir_1_1
 *          - file_1_1_1
 *        - file_1_1
 *      - dir_2 (일반삭제 확인용)
 *      - dir_3 (삭제 이후 잔여 확인용)
 *      - file_1 (삭제 이후 잔여 확인용)
 *
 * 다음 순서로 테스트 한다.
 * 1. dir_2 삭제
 * 2. dir_1 삭제
 */
export class WorkCompleted extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType

  private dirOId_root: string
  private dirOId_1: string
  private dirOId_1_1: string
  private dirOId_2: string
  private dirOId_3: string
  private fileOId_1: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userName, signUpType, userOId} = user
      const jwtPayload: JwtPayloadType = {userId, userName, signUpType, userOId}
      this.jwtPayload = jwtPayload

      // 1. 기존 루트 디렉토리의 이름을 잠시 변경한다.
      const {directory: rootDir} = this.testDB.getRootDir()
      const _id_root = new Types.ObjectId(rootDir.dirOId)
      await this.db.collection('directorydbs').updateOne({_id: _id_root}, {$set: {dirName: 'GROOT'}})

      // 2. 디렉토리생성: 새로운 루트 디렉토리 생성
      const data_root: AddDirectoryDataType = {dirName: 'root', parentDirOId: 'NULL'}
      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data_root)

      // 3. 디렉토리생성: 루트에 1번째 디렉토리 생성
      const parentDirOId = extraDirs.dirOIdsArr[0]
      const data_dir1: AddDirectoryDataType = {dirName: this.constructor.name + '_1', parentDirOId}
      const {extraDirs: extraDirs_dir1} = await this.portService.addDirectory(jwtPayload, data_dir1)

      this.dirOId_root = parentDirOId

      // 4. 디렉토리생성: 1번 디렉토리에 1_1 디렉토리 생성
      const parentDirOId_dir1 = extraDirs_dir1.dirOIdsArr[1]
      const data_dir1_1: AddDirectoryDataType = {dirName: this.constructor.name + '_1_1', parentDirOId: parentDirOId_dir1}
      const {extraDirs: extraDirs_dir1_1} = await this.portService.addDirectory(jwtPayload, data_dir1_1)

      this.dirOId_1 = parentDirOId_dir1

      // 5. 파일생성: 1_1 디렉토리에 1_1_1 파일 생성
      const parentDirOId_dir1_1 = extraDirs_dir1_1.dirOIdsArr[1]
      const data_file1_1_1: AddFileDataType = {fileName: this.constructor.name + '_1_1_1', parentDirOId: parentDirOId_dir1_1}
      await this.portService.addFile(jwtPayload, data_file1_1_1)

      this.dirOId_1_1 = parentDirOId_dir1_1

      // 6. 파일생성: 1번째 디렉토리에 1_1 파일 생성
      const data_file1_1: AddFileDataType = {fileName: this.constructor.name + '_1_1', parentDirOId: parentDirOId_dir1}
      await this.portService.addFile(jwtPayload, data_file1_1)

      // 7. 디렉토리생성: 루트에 2번째 디렉토리 생성
      const data_dir2: AddDirectoryDataType = {dirName: this.constructor.name + '_2', parentDirOId}
      const {extraDirs: extraDirs_after_dir2} = await this.portService.addDirectory(jwtPayload, data_dir2)

      this.dirOId_2 = extraDirs_after_dir2.dirOIdsArr[2]

      // 8. 디렉토리생성: 루트에 3번째 디렉토리 생성
      const data_dir3: AddDirectoryDataType = {dirName: this.constructor.name + '_3', parentDirOId}
      const {extraDirs: extraDirs_after_dir3} = await this.portService.addDirectory(jwtPayload, data_dir3)

      this.dirOId_3 = extraDirs_after_dir3.dirOIdsArr[3]

      // 9. 파일생성: 루트에 파일 생성
      const data_file1: AddFileDataType = {fileName: this.constructor.name + '_1', parentDirOId}
      const {extraFileRows} = await this.portService.addFile(jwtPayload, data_file1)
      this.fileOId_1 = extraFileRows.fileOIdsArr[0]
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._1_delete_dir2.bind(this), db, logLevel)
      await this.memberOK(this._2_delete_dir1.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('directorydbs').deleteOne({dirName: 'root'})
      await this.db.collection('directorydbs').deleteOne({dirName: `${this.constructor.name}_1`})
      await this.db.collection('directorydbs').deleteOne({dirName: `${this.constructor.name}_2`})
      await this.db.collection('directorydbs').deleteOne({dirName: `${this.constructor.name}_3`})
      await this.db.collection('directorydbs').deleteOne({dirName: `${this.constructor.name}_1_1`})

      await this.db.collection('filedbs').deleteOne({name: `${this.constructor.name}_1_1_1`})
      await this.db.collection('filedbs').deleteOne({name: `${this.constructor.name}_1_1`})
      await this.db.collection('filedbs').deleteOne({name: `${this.constructor.name}_1`})

      await this.testDB.resetBaseDB()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_delete_dir2(db: Db, logLevel: number) {
    try {
      /**
       * 1. root 디렉토리 정보 확인
       * 2. dir_1 정보 확인
       * 3. dir_3 정보 확인
       * 4. file_1 정보 확인
       */
      const {dirOId_1, dirOId_2, dirOId_3, dirOId_root, jwtPayload} = this
      const {extraDirs, extraFileRows} = await this.portService.deleteDirectory(jwtPayload, dirOId_2)

      /**
       * 1. root 디렉토리 정보 확인
       *    1-1. extraDirs 의 첫번째에 있나
       *    1-2. extraFileRows 에 root 들어있나
       *    1-3. root 의 subDirOIdsArr 길이 2인가
       *    1-4. root 의 fileOIdsArr 길이가 1인가
       */
      if (extraDirs.dirOIdsArr[0] !== dirOId_root) throw `1-1. root 의 OId 가 첫번째에 있지 않습니다.`
      if (extraDirs.directories[dirOId_root].dirName !== 'root') throw `1-2. root 의 이름이 root 가 아닙니다.`
      if (extraDirs.directories[dirOId_root].subDirOIdsArr.length !== 2) throw `1-3. root 의 하위 디렉토리 수가 2개가 아닙니다.`
      if (extraDirs.directories[dirOId_root].fileOIdsArr.length !== 1) throw `1-4. root 의 파일 수가 1개가 아닙니다.`

      /**
       * 2. dir_1 정보 확인
       *    2-1. extraDirs 의 두번째에 있나
       *    2-2. extraFileRows 에 dir_1 들어있나
       *    2-3. dir_1 의 subDirOIdsArr 길이 1인가
       *    2-4. dir_1 의 fileOIdsArr 길이가 1인가
       */
      if (extraDirs.dirOIdsArr[1] !== dirOId_1) throw `2-1. dir_1 의 OId 가 두번째에 있지 않습니다.`
      if (extraDirs.directories[dirOId_1].dirName !== `${this.constructor.name}_1`)
        throw `2-2. dir_1 의 이름이 ${this.constructor.name}_1 이 아닙니다.`
      if (extraDirs.directories[dirOId_1].subDirOIdsArr.length !== 1) throw `2-3. dir_1 의 하위 디렉토리 수가 1개가 아닙니다.`
      if (extraDirs.directories[dirOId_1].fileOIdsArr.length !== 1) throw `2-4. dir_1 의 파일 수가 1개가 아닙니다.`

      /**
       * 3. dir_3 정보 확인
       *    3-1. extraDirs 의 세번째에 있나
       *    3-2. extraFileRows 에 dir_3 들어있나
       *    3-3. dir_3 의 subDirOIdsArr 길이 0인가
       *    3-4. dir_3 의 fileOIdsArr 길이가 0인가
       */
      if (extraDirs.dirOIdsArr[2] !== dirOId_3) throw `3-1. dir_3 의 OId 가 세번째에 있지 않습니다.`
      if (extraDirs.directories[dirOId_3].dirName !== `${this.constructor.name}_3`)
        throw `3-2. dir_3 의 이름이 ${this.constructor.name}_3 이 아닙니다.`
      if (extraDirs.directories[dirOId_3].subDirOIdsArr.length !== 0) throw `3-3. dir_3 의 하위 디렉토리 수가 0개가 아닙니다.`
      if (extraDirs.directories[dirOId_3].fileOIdsArr.length !== 0) throw `3-4. dir_3 의 파일 수가 0개가 아닙니다.`

      /**
       * 4. file_1 정보 확인
       *    4-1. extraFileRows 에 file_1 들어있나
       */
      if (extraFileRows.fileOIdsArr.length !== 1) throw `4-1. 루트의 파일이 1개가 아니고 ${extraFileRows.fileOIdsArr.length}개 입니다.`
      const fileOId_1 = extraFileRows.fileOIdsArr[0]
      if (extraFileRows.fileRows[fileOId_1].name !== `${this.constructor.name}_1`)
        throw `4-2. file_1 의 이름이 ${this.constructor.name}_1 이 아닙니다. 현재 이름은 ${extraFileRows.fileRows[fileOId_1].name} 입니다.`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
    }
  }
  private async _2_delete_dir1(db: Db, logLevel: number) {
    try {
      /**
       * 1. root 디렉토리 정보 확인
       * 2. dir_1 정보 안 들어왔는지 확인
       * 3. 내부 디렉토리 및 파일들 실제 삭제되었는지 확인
       */
      const {jwtPayload, dirOId_1, dirOId_3, dirOId_root, fileOId_1} = this
      const {extraDirs} = await this.portService.deleteDirectory(jwtPayload, dirOId_1)

      /**
       * 1. root 디렉토리 정보 확인
       *    1-1. root 의 subDirOIdsArr 길이 1인가
       *    1-2. root 의 fileOIdsArr 길이가 1인가
       */
      if (extraDirs.directories[dirOId_root].subDirOIdsArr.length !== 1) throw `1-1. root 의 하위 디렉토리 수가 1개가 아닙니다.`
      if (extraDirs.directories[dirOId_root].fileOIdsArr.length !== 1) throw `1-2. root 의 파일 수가 1개가 아닙니다.`

      /**
       * 2. dir_1 정보 안 들어왔는지 확인
       *    2-1. extraDirs.dirOIdsArr 에 dir_1 들어있나
       *    2-2. extraDirs.directories 에 dir_1 의 정보가 들어있나
       *    2-3. rootDir 에 dir_1 정보가 들어있나나
       */
      if (extraDirs.dirOIdsArr.includes(dirOId_1)) throw `2-1. dir_1 이 삭제되지 않았습니다.`
      if (extraDirs.directories[dirOId_1]) throw `2-2. dir_1 이 삭제되지 않았습니다.`
      if (extraDirs.directories[dirOId_root].subDirOIdsArr.includes(dirOId_1)) throw `2-3. root 의 하위 디렉토리 중에 dir_1 이 있습니다.`

      /**
       * 3. 삭제될거 삭제되고 안될거 안됬는지 확인
       */
      const {extraDirs: _entireDirs, extraFiles: _entireFiles} = await this.portService.GET_ENTIRE_DIRECTORY_INFO('test')
      const _dirOId_root = _entireDirs.dirOIdsArr[0]
      if (dirOId_root !== _dirOId_root) throw `3-1. 루트의 OID 가 가장 먼저 와야함.`

      const _rootDir = _entireDirs.directories[_dirOId_root]
      if (_rootDir.subDirOIdsArr.includes(dirOId_1)) throw `3-2. 루트의 하위 디렉토리 중에 dir_1 이 있습니다.`

      if (!_rootDir.subDirOIdsArr.includes(dirOId_3)) throw `3-3. 루트의 하위 디렉토리 중에 dir_3 이 없습니다.`

      if (!_entireDirs.directories[dirOId_3]) throw `3-4. dir_3 이 삭제되었습니다.`

      if (!_rootDir.fileOIdsArr.includes(fileOId_1)) throw `3-5. 루트의 파일 중에 file_1 이 없습니다.`

      if (!_entireFiles.fileRows[fileOId_1]) throw `3-6. file_1 이 삭제되었습니다.`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WorkCompleted(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
