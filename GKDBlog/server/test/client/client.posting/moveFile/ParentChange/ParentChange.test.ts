/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/database'
import {ErrorCases} from './errorCases'
import {AUTH_ADMIN} from '@common/secret'
import {AddDirectoryDataType, AddFileDataType, DirectoryType, JwtPayloadType, MoveFileDataType} from '@common/types'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * moveFile 에서 부모가 바뀌는 경우
 *
 * 서브 모듈
 * - 에러 케이스
 *
 * 서브 테스트 준비
 * - 루트 폴더에 부모 폴더를 만든다.
 * - 부모 폴더에 자식 폴더를 2개 만든다.
 * - 부모 폴더에 파일을 1개 만든다.
 * - 각 자식에 폴더를 1개씩 만든다.
 * - 각 자식 폴더에 파일을 8개씩 만든다.
 *
 * 서브 테스트
 * 1. 자식 폴더로 이동 하는가
 * 2. 형제 폴더로 이동 하는가
 */
export class ParentChange extends GKDTestBase {
  private ErrorCases: ErrorCases

  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType

  private parentDir: DirectoryType
  private parentDirOId: string
  private subDir_0: DirectoryType
  private subDir_0_0: DirectoryType
  private subDir_1: DirectoryType

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.ErrorCases = new ErrorCases(REQUIRED_LOG_LEVEL + 1)
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

      const {directory: rootDir} = this.testDB.getRootDir()

      // 1. 루트 폴더에 부모 폴더를 만든다.
      const rootDirOId = rootDir.dirOId
      const dirName = this.constructor.name
      const data: AddDirectoryDataType = {dirName, parentDirOId: rootDirOId}
      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

      const parentDirOId = extraDirs.dirOIdsArr.filter(dirOId => extraDirs.directories[dirOId].dirName === dirName)[0]
      this.parentDirOId = parentDirOId

      // 2. 부모 폴더에 자식 폴더를 2개 만든다.
      for (let i = 0; i < 2; i++) {
        const dirName = this.constructor.name + `_${i}`
        const data: AddDirectoryDataType = {dirName, parentDirOId}
        await this.portService.addDirectory(jwtPayload, data)
      }

      // 3. 부모 폴더에 파일을 1개 만든다.
      const fileName = this.constructor.name + `_0`
      const dataFile: AddFileDataType = {fileName, parentDirOId}
      const {extraDirs: extraDirs2} = await this.portService.addFile(jwtPayload, dataFile)

      this.parentDir = extraDirs2.directories[parentDirOId]

      // 4. 각 자식 폴더에 폴더를 1개씩 만든다.
      for (let i = 0; i < 2; i++) {
        const dirName = this.constructor.name + `_${i}_0`
        const parentDirOId = this.parentDir.subDirOIdsArr[i]
        const data: AddDirectoryDataType = {dirName, parentDirOId}
        const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

        if (i === 0) {
          this.subDir_0 = extraDirs.directories[parentDirOId]

          const dirOId_0_0 = extraDirs.dirOIdsArr.filter(dirOId => extraDirs.directories[dirOId].dirName === dirName)[0]
          this.subDir_0_0 = extraDirs.directories[dirOId_0_0]
        } // ::
        else {
          this.subDir_1 = extraDirs.directories[parentDirOId]
        }
      }

      // 5. 각 자식 폴더에 파일을 8개씩 만든다.
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 8; j++) {
          const fileName = this.constructor.name + `_${i}_${j}`
          const parentDirOId = this.parentDir.subDirOIdsArr[i]
          const data: AddFileDataType = {fileName, parentDirOId}
          const {extraDirs} = await this.portService.addFile(jwtPayload, data)

          if (i === 0) {
            this.subDir_0 = extraDirs.directories[parentDirOId]
          } // ::
          else {
            this.subDir_1 = extraDirs.directories[parentDirOId]
          }
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.ErrorCases.testOK(db, logLevel)

      await this.memberOK(this._1_move_to_child.bind(this), db, logLevel)
      await this.memberOK(this._2_move_to_sibling.bind(this), db, logLevel)

      this.logMessage(`조상 폴더로 들어가는지 테스트하는거 구현 안됨`, 0)
      this.logMessage(`조상 폴더로 들어가는지 테스트하는거 구현 안됨`, 0)
      this.logMessage(`조상 폴더로 들어가는지 테스트하는거 구현 안됨`, 1)
      this.logMessage(`조상 폴더로 들어가는지 테스트하는거 구현 안됨`, 1)
      this.logMessage(`조상 폴더로 들어가는지 테스트하는거 구현 안됨`, 0)
      this.logMessage(`조상 폴더로 들어가는지 테스트하는거 구현 안됨`, 0)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await Promise.all(
        Array(2)
          .fill(null)
          .map(async (_, i) => {
            await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + `_${i}`})
            await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + `_${i}_0`})

            await Promise.all(
              Array(8)
                .fill(null)
                .map(async (_, j) => {
                  await this.db.collection('filedbs').deleteOne({name: this.constructor.name + `_${i}_${j}`})
                })
            )
          })
      )

      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name})
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name + `_0`})

      await this.testDB.resetBaseDB()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_move_to_child(db: Db, logLevel: number) {
    /**
     * 자식 폴더로 파일을 이동한다.
     * - subDir_0 의 0번째 파일을 subDir_0_0 의 0번째로 옮긴다.
     *
     * 점검사항
     * 1. extraDirs
     *   1-1. 목적지 디렉토리 관련 점검
     *     1-1-1. 배열의 0번째 인덱스가 목적지 디렉토리인가?
     *     1-1-2. 목적지 디렉토리를 잘 받아왔나?
     *     1-1-3. 목적지 디렉토리의 자식 폴더 배열 길이가 올바른가?
     *     1-1-4. 목적지 디렉토리의 파일 배열의 길이가 올바른가?
     *     1-1-5. 목적지 디렉토리의 파일행에 이동한 파일이 있는가?
     *
     *   1-2. 원본 디렉토리 관련 점검
     *     1-2-1. 배열의 1번째 인덱스가 원래 부모 디렉토리인가?
     *     1-2-2. 원본 디렉토리를 잘 받아왔나?
     *     1-2-3. 원본 디렉토리의 자식 폴더 배열 길이가 올바른가?
     *     1-2-4. 원본 디렉토리의 파일 배열의 길이가 올바른가?
     *     1-2-5. 원본 디렉토리의 파일행의 순서가 올바른가?
     *
     * 2. extraFileRows
     *   2-1-1. 배열의 0번째 인덱스가 옮겨진 파일인가?
     *   2-1-2. 옮겨진 파일의 파일row 가 들어왔나?
     *
     *   2-2. 기존 부모의 현재 파일들이 파일행에 잘 들어왔나?
     */
    try {
      const {jwtPayload, subDir_0, subDir_0_0} = this

      const moveFileOId = subDir_0.fileOIdsArr[0]
      const targetDirOId = subDir_0_0.dirOId
      const targetIdx = 0

      const data: MoveFileDataType = {moveFileOId, targetDirOId, targetIdx}

      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)
      const {directories, dirOIdsArr} = extraDirs
      const {fileOIdsArr, fileRows} = extraFileRows

      /**
       * 1. extraDirs
       *   1-1. 목적지 디렉토리 관련 점검
       *     1-1-1. 배열의 0번째 인덱스가 목적지 디렉토리인가?
       *     1-1-2. 목적지 디렉토리를 잘 받아왔나?
       *     1-1-3. 목적지 디렉토리의 자식 폴더 배열 길이가 올바른가?
       *     1-1-4. 목적지 디렉토리의 파일 배열의 길이가 올바른가?
       *     1-1-5. 목적지 디렉토리의 파일행에 이동한 파일이 있는가?
       */

      // 1-1-1. 배열의 0번째 인덱스가 목적지 디렉토리인가?
      const _targetDirOid = dirOIdsArr[0]
      if (_targetDirOid !== targetDirOId) throw `1-1-1. 배열의 0번째 OId 가 ${targetDirOId} 가 아닌 ${_targetDirOid} 이다.`

      // 1-1-2. 목적지 디렉토리를 잘 받아왔나?
      const targetDir = directories[_targetDirOid]
      if (!targetDir) throw `1-1-2. 목적지 디렉토리가 없어요`

      // 1-1-3. 목적지 디렉토리의 자식 폴더 배열 길이가 올바른가?
      const _targetDirLen = targetDir.subDirOIdsArr.length
      if (_targetDirLen !== 0) throw `1-1-3. 목적지의 자식폴더 갯수가 0개가 아니라 ${_targetDirLen} 개 이다.`

      // 1-1-4. 목적지 디렉토리의 파일 배열의 길이가 올바른가?
      const _targetDirFileLen = targetDir.fileOIdsArr.length
      if (_targetDirFileLen !== 1) throw `1-1-4. 목적지의 파일 갯수가 1개가 아니라 ${_targetDirFileLen} 개 이다.`

      // 1-1-5. 목적지 디렉토리의 파일행에 이동한 파일이 있는가?
      if (moveFileOId !== targetDir.fileOIdsArr[0])
        throw `1-1-5. 목적지의 파일 배열의 0번째 OId 가 ${moveFileOId} 가 아닌 ${targetDir.fileOIdsArr[0]} 이다.`

      /**
       * 1. extraDirs
       *   1-2. 원본 디렉토리 관련 점검
       *     1-2-1. 배열의 1번째 인덱스가 원래 부모 디렉토리인가?
       *     1-2-2. 원본 디렉토리를 잘 받아왔나?
       *     1-2-3. 원본 디렉토리의 자식 폴더 배열 길이가 올바른가?
       *     1-2-4. 원본 디렉토리의 파일 배열의 길이가 올바른가?
       *     1-2-5. 원본 디렉토리의 파일행의 순서가 올바른가?
       */

      // 1-2-1. 배열의 1번째 인덱스가 원래 부모 디렉토리인가?
      const oldDirOId = dirOIdsArr[1]
      if (oldDirOId !== subDir_0.dirOId) throw `1-2-1. 배열의 1번째 OId 가 ${subDir_0.dirOId} 가 아닌 ${oldDirOId} 이다.`

      // 1-2-2. 원본 디렉토리를 잘 받아왔나?
      const oldDir = directories[oldDirOId]
      if (!oldDir) throw `1-2-2. 원본 디렉토리가 없어요`

      // 1-2-3. 원본 디렉토리의 자식 폴더 배열 길이가 올바른가?
      const _oldDirLen = oldDir.subDirOIdsArr.length
      if (_oldDirLen !== 1) throw `1-2-3. 원본 디렉토리의 자식폴더 갯수가 1개가 아니라 ${_oldDirLen} 개 이다.`

      // 1-2-4. 원본 디렉토리의 파일 배열의 길이가 올바른가?
      const _oldDirFileLen = oldDir.fileOIdsArr.length
      if (_oldDirFileLen !== 7) throw `1-2-4. 원본 디렉토리의 파일 갯수가 7개가 아니라 ${_oldDirFileLen} 개 이다.`

      // 1-2-5. 원본 디렉토리의 파일행의 순서가 올바른가?
      const sequenceFile = oldDir.fileOIdsArr.map(fileOId => subDir_0.fileOIdsArr.indexOf(fileOId)).join(',')
      if (sequenceFile !== '1,2,3,4,5,6,7') throw `1-2-5. 원래부모 파일순서가 1,2,3,4,5,6,7 이 아니라 ${sequenceFile} 이다.`

      /**
       * 2. extraFileRows
       *   2-1. 배열의 0번째 인덱스가 옮겨진 파일인가?
       *   2-2. 옮겨진 파일의 파일row 가 들어왔나?
       */

      // 2-1. 배열의 0번째 인덱스가 옮겨진 파일인가?
      const _fileOId = fileOIdsArr[0]
      if (_fileOId !== moveFileOId) throw `2-1-1. 배열의 0번째 OId 가 ${moveFileOId} 가 아닌 ${_fileOId} 이다.`

      // 2-2. 옮겨진 파일의 파일row 가 들어왔나?
      const _fileRow = fileRows[moveFileOId]
      if (!_fileRow) throw `2-1-2. 옮겨진 파일의 파일row 가 없어요`
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_move_to_sibling(db: Db, logLevel: number) {
    /**
     * subDir_0 의 0번째 파일(file_1)을 subDir_1 의 0번째로 옮긴다.
     *
     * 점검사항
     * 1. extraDirs
     *   1-1. 목적지 디렉토리 관련 점검
     *     1-1-1. 배열의 0번째 인덱스가 목적지 디렉토리인가?
     *     1-1-2. 목적지 디렉토리를 잘 받아왔나?
     *     1-1-3. 목적지 디렉토리의 자식 폴더 배열 길이가 올바른가?
     *     1-1-4. 목적지 디렉토리의 파일 배열의 길이가 올바른가?
     *     1-1-5. 목적지 디렉토리의 파일행에 이동한 파일이 있는가?
     *
     *   1-2. 원본 디렉토리 관련 점검
     *     1-2-1. 배열의 2번째 인덱스가 원래 부모 디렉토리인가? (subDir_1 의 자식폴더가 인덱스 1이다)
     *     1-2-2. 원본 디렉토리를 잘 받아왔나?
     *     1-2-3. 원본 디렉토리의 자식 폴더 배열 길이가 올바른가?
     *     1-2-4. 원본 디렉토리의 파일 배열의 길이가 올바른가?
     *     1-2-5. 원본 디렉토리의 파일행의 순서가 올바른가?
     *
     * 2. extraFileRows
     *   2-1. 옮긴 파일 정보 확인
     *     2-1-1. 파일 0번째로 들어왔나 확인
     *     2-1-2. 파일 잘 들어왔나 확인
     *
     *   2-2. 목적지 폴더의 파일 정보 확인
     *     2-2-1. 각 파일마다 OId 잘 들어왔나 확인
     *     2-2-2. 각 파일마다 fileRows 에 들어왔나 확인
     *
     *   2-3. 원래 폴더 파일 정보 확인
     *     2-3-1. 각 파일마다 OId 잘 들어왔나 확인
     *     2-3-2. 각 파일마다 fileRows 에 들어왔나 확인
     */
    try {
      const {jwtPayload, subDir_0, subDir_1} = this

      const moveFileOId = subDir_0.fileOIdsArr[1]
      const targetDirOId = subDir_1.dirOId
      const targetIdx = 0

      const data: MoveFileDataType = {moveFileOId, targetDirOId, targetIdx}

      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)
      const {directories, dirOIdsArr} = extraDirs
      const {fileOIdsArr, fileRows} = extraFileRows

      /**
       * 1. extraDirs
       *   1-1. 목적지 디렉토리 관련 점검
       *     1-1-1. 배열의 0번째 인덱스가 목적지 디렉토리인가?
       *     1-1-2. 목적지 디렉토리를 잘 받아왔나?
       *     1-1-3. 목적지 디렉토리의 자식 폴더 배열 길이가 올바른가?
       *     1-1-4. 목적지 디렉토리의 파일 배열의 길이가 올바른가?
       *     1-1-5. 목적지 디렉토리의 파일행에 이동한 파일이 있는가?
       */

      // 1-1-1. 배열의 0번째 인덱스가 목적지 디렉토리인가?
      const _targetDirOid = dirOIdsArr[0]
      if (_targetDirOid !== targetDirOId) throw `1-1-1. 배열의 0번째 OId 가 ${targetDirOId} 가 아닌 ${_targetDirOid} 이다.`

      // 1-1-2. 목적지 디렉토리를 잘 받아왔나?
      const _targetDir = directories[_targetDirOid]
      if (!_targetDir) throw `1-1-2. 목적지 디렉토리를 못 읽어왔어요`

      // 1-1-3. 목적지 디렉토리의 자식 폴더 배열 길이가 올바른가?
      const _targetDirLen = _targetDir.subDirOIdsArr.length
      if (_targetDirLen !== 1) throw `1-1-3. 목적지의 자식폴더 갯수가 1개가 아니라 ${_targetDirLen} 개 이다.`

      // 1-1-4. 목적지 디렉토리의 파일 배열의 길이가 올바른가?
      const _targetDirFileLen = _targetDir.fileOIdsArr.length
      if (_targetDirFileLen !== 9) throw `1-1-4. 목적지의 파일 갯수가 9개가 아니라 ${_targetDirFileLen} 개 이다.`

      // 1-1-5. 목적지 디렉토리의 파일행에 이동한 파일이 있는가?
      const _targetDirFileOId = _targetDir.fileOIdsArr[0]
      if (_targetDirFileOId !== moveFileOId) throw `1-1-5. 목적지의 파일 배열의 0번째 OId 가 ${moveFileOId} 가 아닌 ${_targetDirFileOId} 이다.`

      /**
       * 1. extraDirs
       *   1-2. 목적지 디렉토리 관련 점검
       *     1-2-1. 배열의 1번째 인덱스가 원래 부모 디렉토리인가?
       *     1-2-2. 원래 디렉토리를 잘 받아왔나?
       *     1-2-3. 원래 디렉토리의 자식 폴더 배열 길이가 올바른가?
       */

      // 1-2-1. 배열의 2번째 인덱스가 원래 부모 디렉토리인가?
      const oldDirOId = dirOIdsArr[2]
      if (oldDirOId !== subDir_0.dirOId) throw `1-2-1. 배열의 1번째 OId 가 ${subDir_0.dirOId} 가 아닌 ${oldDirOId} 이다.`

      // 1-2-2. 원래래 디렉토리를 잘 받아왔나?
      const _oldDir = directories[oldDirOId]
      if (!_oldDir) throw `1-2-2. 원래 디렉토리를 못 읽어왔어요`

      // 1-2-3. 원래 디렉토리의 자식 폴더 배열 길이가 올바른가?
      const _oldDirLen = _oldDir.subDirOIdsArr.length
      if (_oldDirLen !== 1) throw `1-2-3. 원래 디렉토리의 자식폴더 갯수가 1개가 아니라 ${_oldDirLen} 개 이다.`

      // 1-2-4. 원래 디렉토리의 파일 배열의 길이가 올바른가?
      const _oldDirFileLen = _oldDir.fileOIdsArr.length
      if (_oldDirFileLen !== 6) throw `1-2-4. 원래 디렉토리의 파일 갯수가 7개가 아니라 ${_oldDirFileLen} 개 이다.`

      // 1-2-5. 원래 디렉토리의 파일행의 순서가 올바른가?
      const sequenceFile = _oldDir.fileOIdsArr.map(fileOId => subDir_0.fileOIdsArr.indexOf(fileOId)).join(',')
      if (sequenceFile !== '2,3,4,5,6,7') throw `1-2-5. 원래부모 파일순서가 2,3,4,5,6,7 이 아니라 ${sequenceFile} 이다.`

      /**
       * 2. extraFileRows
       *   2-1. 옮긴 파일 정보 확인
       *     2-1-1. 파일 0번째로 들어왔나 확인
       *     2-1-2. 파일 잘 들어왔나 확인
       */

      // 2-1-1. 파일 0번째로 들어왔나 확인
      const _fileOId = fileOIdsArr[0]
      if (_fileOId !== moveFileOId) throw `2-1-1. 배열의 0번째 OId 가 ${moveFileOId} 가 아닌 ${_fileOId} 이다.`

      // 2-1-2. 파일 잘 들어왔나 확인
      const _fileRow = fileRows[moveFileOId]
      if (!_fileRow) throw `2-1-2. 옮겨진 파일의 파일row 가 없어요`

      /**
       * 2. extraFileRows
       *   2-2. 목적지 폴더의 파일 정보 확인
       *     2-2-1. 각 파일마다 OId 잘 들어왔나 확인
       *     2-2-2. 각 파일마다 fileRows 에 들어왔나 확인
       */

      // 2-2-1. 각 파일마다 OId 잘 들어왔나 확인
      // 2-2-2. 각 파일마다 fileRows 에 들어왔나 확인
      for (let i = 0; i < _targetDirFileLen; i++) {
        const fileOId = _targetDir.fileOIdsArr[i]
        if (!fileOIdsArr.includes(fileOId)) throw `2-2-1. 목적지의 파일 배열의 ${i}번째 파일 OId 가 안 들어왔다.`

        const fileRow = fileRows[fileOId]
        if (!fileRow) throw `2-2-2. 목적지의 파일 배열의 ${i}번째 파일 fileRow 가 안 들어왔다.`
      }

      /**
       * 2. extraFileRows
       *   2-3. 원래 폴더의 파일 정보 확인
       *     2-3-1. 각 파일마다 OId 잘 들어왔나 확인
       *     2-3-2. 각 파일마다 fileRows 에 들어왔나 확인
       */

      // 2-3-1. 각 파일마다 OId 잘 들어왔나 확인
      // 2-3-2. 각 파일마다 fileRows 에 들어왔나 확인
      for (let i = 2; i < _oldDirFileLen; i++) {
        // 0번째는 자식으로 들어가서 여기선 안 들어온다.
        const fileOId = _oldDir.fileOIdsArr[i]
        if (!fileOIdsArr.includes(fileOId)) throw `2-3-1. 원래 디렉토리의 파일 배열의 ${i}번째 파일 OId 가 안 들어왔다.`

        const fileRow = fileRows[fileOId]
        if (!fileRow) throw `2-3-2. 원래 디렉토리의 파일 배열의 ${i}번째 파일 fileRow 가 안 들어왔다.`
      }

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
  const testModule = new ParentChange(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
