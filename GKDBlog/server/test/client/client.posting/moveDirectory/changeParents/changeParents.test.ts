/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import {ErrorCases} from './errorCases'
import {ClientPortServiceTest} from '@modules/database'
import {AddDirectoryDataType, AddFileDataType, DirectoryType, JwtPayloadType, MoveDirectoryDataType} from '@common/types'
import {AUTH_ADMIN} from '@common/secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * moveDirectory 에서 부모폴더가 바뀌는 경우를 테스트한다.
 * - 서브 모듈 및 테스트를 점검하므로 testOK 로 실행한다.
 *
 * 테스트 준비(루트에 새로 생성할 디렉토리 구조)
 * - GrandParent
 *   - Dir_0
 *     - Dir_0_0
 *       - Dir_0_0_0
 *       + File_0_0_0
 *     - Dir_0_1
 *       - Dir_0_1_0
 *       + File_0_1_0
 *     - Dir_0_2
 *     - Dir_0_3
 *     - Dir_0_4
 *     - Dir_0_5
 *     + File_0_0
 *   - Dir_1
 *     - Dir_1_0
 *       - Dir_1_0_0
 *       + File_1_0_0
 *     - Dir_1_1
 *     - Dir_1_2
 *     + File_1_0
 *
 * 서브 모듈
 * - 에러 케이스 점검
 *
 * 서브 테스트(정상 케이스)
 * 1. Sibling 의 자식으로 만들기
 * 2. GrandParent 의 자식으로 만들기
 * 3. 삼촌 디렉토리의 다양한 인덱스로 이동 시도
 *   3-1. 0번째 인덱스
 *   3-2. 2번째 인덱스
 *   3-3. 마지막 인덱스(null 입력)
 */
export class ChangeParents extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private ErrorCases: ErrorCases

  private dirGrand: DirectoryType
  private dir_0: DirectoryType
  private dir_1: DirectoryType

  private jwtPayload: JwtPayloadType

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.ErrorCases = new ErrorCases(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    /**
     * 1. GrandParent 가 될 root 의 자식을 만든다.
     * 2. GrandParent 에 자식폴더 2개를 만든다. (Dir_0, Dir_1)
     * 3. Dir_0 에 자식 폴더를 6개, 파일을 1개 만든다
     * 4. Dir_1 에 자식 폴더를 3개, 파일을 1개 만든다
     * 5. Dir_0 의 0번째 자식에 파일과 폴더를 1개씩 만든다.
     * 6. Dir_0 의 1번째 자식에 파일과 폴더를 1개씩 만든다.
     * 7. Dir_1 의 0번째 자식에 파일과 폴더를 1개씩 만든다.
     */
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
      const rootDirOId = rootDir.dirOId

      // 1. GrandParent 가 될 root 의 자식을 만든다.
      const dataGrand: AddDirectoryDataType = {
        parentDirOId: rootDirOId,
        dirName: this.constructor.name
      }
      const {extraDirs: extraDirsRoot} = await this.portService.addDirectory(jwtPayload, dataGrand)

      // 2. GrandParent 에 자식폴더 2개를 만든다.
      const {dirOIdsArr: rootArr, directories: rootDirs} = extraDirsRoot
      const grandDirOId = rootArr.filter(dirOId => rootDirs[dirOId].dirName === this.constructor.name)[0]
      this.dirGrand = rootDirs[grandDirOId]

      const dataDir0: AddDirectoryDataType = {
        parentDirOId: grandDirOId,
        dirName: this.constructor.name + '_0'
      }
      const dataDir1: AddDirectoryDataType = {
        parentDirOId: grandDirOId,
        dirName: this.constructor.name + '_1'
      }
      await this.portService.addDirectory(jwtPayload, dataDir0)
      const {extraDirs: extraDirsGrand} = await this.portService.addDirectory(jwtPayload, dataDir1)

      const {dirOIdsArr: grandArr, directories: grandDirs} = extraDirsGrand

      this.dirGrand = grandDirs[grandDirOId]

      const dir_0_OId = grandArr[1]
      const dir_1_OId = grandArr[2]

      // 3. Dir_0 에 자식 폴더를 6개, 파일을 1개 만든다
      for (let i = 0; i < 6; i++) {
        const dataDir: AddDirectoryDataType = {
          parentDirOId: dir_0_OId,
          dirName: this.constructor.name + '_0_' + i
        }
        await this.portService.addDirectory(jwtPayload, dataDir)
      }
      const dataFile0: AddFileDataType = {
        parentDirOId: dir_0_OId,
        fileName: this.constructor.name + '_0_0'
      }
      const {extraDirs: extraDirsDir0} = await this.portService.addFile(jwtPayload, dataFile0)
      this.dir_0 = extraDirsDir0.directories[dir_0_OId]

      // 4. Dir_1 에 자식 폴더를 3개, 파일을 1개 만든다
      for (let i = 0; i < 3; i++) {
        const dataDir: AddDirectoryDataType = {
          parentDirOId: dir_1_OId,
          dirName: this.constructor.name + '_1_' + i
        }
        await this.portService.addDirectory(jwtPayload, dataDir)
      }
      const dataFile1: AddFileDataType = {
        parentDirOId: dir_1_OId,
        fileName: this.constructor.name + '_1_0'
      }
      const {extraDirs: extraDirsDir1} = await this.portService.addFile(jwtPayload, dataFile1)
      this.dir_1 = extraDirsDir1.directories[dir_1_OId]

      // 5. Dir_0 의 0번째 자식에 파일과 폴더를 1개씩 만든다
      const dir_0_0_OId = this.dir_0.subDirOIdsArr[0]
      const dataDir0_0_Dir: AddDirectoryDataType = {
        parentDirOId: dir_0_0_OId,
        dirName: this.constructor.name + '_0_0_0'
      }
      const dataDir0_0_File: AddFileDataType = {
        parentDirOId: dir_0_0_OId,
        fileName: this.constructor.name + '_0_0_0'
      }

      await this.portService.addDirectory(jwtPayload, dataDir0_0_Dir)
      await this.portService.addFile(jwtPayload, dataDir0_0_File)

      // 6. Dir_0 의 1번째 자식에 파일과 폴더를 1개씩 만든다
      const dir_0_1_OId = this.dir_0.subDirOIdsArr[1]
      const dataDir0_1_Dir: AddDirectoryDataType = {
        parentDirOId: dir_0_1_OId,
        dirName: this.constructor.name + '_0_1_0'
      }
      const dataDir0_1_File: AddFileDataType = {
        parentDirOId: dir_0_1_OId,
        fileName: this.constructor.name + '_0_1_0'
      }
      await this.portService.addDirectory(jwtPayload, dataDir0_1_Dir)
      await this.portService.addFile(jwtPayload, dataDir0_1_File)

      // 7. Dir_1 의 0번째 자식에 파일과 폴더를 1개씩 만든다
      const dir_1_0_OId = this.dir_1.subDirOIdsArr[0]
      const dataDir1_0_Dir: AddDirectoryDataType = {
        parentDirOId: dir_1_0_OId,
        dirName: this.constructor.name + '_1_0_0'
      }
      const dataDir1_0_File: AddFileDataType = {
        parentDirOId: dir_1_0_OId,
        fileName: this.constructor.name + '_1_0_0'
      }
      await this.portService.addDirectory(jwtPayload, dataDir1_0_Dir)
      await this.portService.addFile(jwtPayload, dataDir1_0_File)

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      // AREA1: 테스트할 서브모듈
      await this.ErrorCases.testOK(db, logLevel)

      // AREA2: 테스트할 멤버함수
      await this.memberOK(this._1_move_to_sibling.bind(this), db, logLevel)
      await this.memberOK(this._2_move_to_grandParent.bind(this), db, logLevel)
      await this.memberOK(this._3_1_move_to_uncle_idx_0.bind(this), db, logLevel)
      await this.memberOK(this._3_2_move_to_uncle_idx_2.bind(this), db, logLevel)
      await this.memberOK(this._3_3_move_to_uncle_idx_null.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name})

      await this.db.collection('directorydbs').deleteMany({parentDirOId: this.dirGrand.dirOId})
      await this.db.collection('directorydbs').deleteMany({parentDirOId: this.dir_0.dirOId})
      await this.db.collection('directorydbs').deleteMany({parentDirOId: this.dir_1.dirOId})

      await this.db.collection('filedbs').deleteMany({parentDirOId: this.dir_0.dirOId})
      await this.db.collection('filedbs').deleteMany({parentDirOId: this.dir_1.dirOId})

      // 부모가 바뀌기 때문에 여기서 지워줘야함.
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_0_0'})

      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_0_0_0'})
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name + '_0_0_0'})
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_0_1_0'})
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name + '_0_1_0'})
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '_1_0_0'})
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name + '_1_0_0'})

      await this.testDB.resetBaseDB()

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_move_to_sibling(db: Db, logLevel: number) {
    /**
     * 상황
     *   - Dir_0_0 을 Dir_0_1 의 0번째 자식으로 만든다.
     *
     * 점검사항
     *   1. 새로운 부모 디렉토리 점검
     *     1-1. 자식폴더 배열 길이 확인
     *     1-2. 자식폴더 배열 내용 확인
     *     1-3. 자식파일 배열 길이 확인
     *     1-4. 자식파일 배열 내용 확인
     *   2. 기존 부모 디렉토리 점검
     *     2-1. 자식폴더 배열 길이 확인
     *     2-2. 자식폴더 배열 내용 확인
     *     2-3. 자식파일 배열 길이 확인
     *     2-4. 자식파일 배열 내용 확인
     */
    try {
      const {dir_0, jwtPayload} = this

      const {dirOId, subDirOIdsArr} = dir_0
      const [moveDirOId, parentDirOId, targetIdx] = [subDirOIdsArr[0], subDirOIdsArr[1], 0]
      const oldParentDirOId = dirOId
      const newParentDirOId = parentDirOId

      const data: MoveDirectoryDataType = {moveDirOId, parentDirOId, targetIdx}

      const {extraDirs, extraFileRows} = await this.portService.moveDirectory(jwtPayload, data)

      /**
       * 1. 새로운 부모 디렉토리 점검
       *   1-1. 자식폴더 배열 길이 확인
       *   1-2. 자식폴더 배열 내용 확인
       *   1-3. 자식파일 배열 길이 확인
       *   1-4. 자식파일 배열 내용 확인
       */
      const newParentDir = extraDirs.directories[newParentDirOId]
      const newDirOIdsArr = newParentDir.subDirOIdsArr
      const newFileOIdsArr = newParentDir.fileOIdsArr

      // 1-1. 새 부모) 자식폴더 배열 길이 확인
      if (newDirOIdsArr.length !== 2) throw `1-1. 새 부모의 자식폴더가 2개가 아니라 ${newDirOIdsArr.length}개이다.`

      // 1-2. 새 부모) 자식폴더 배열 내용 확인
      const [newSubDirOId0, newSubDirOId1] = [newDirOIdsArr[0], newDirOIdsArr[1]]
      const newSubDir0 = extraDirs.directories[newSubDirOId0]
      const newSubDir1 = extraDirs.directories[newSubDirOId1]
      const newSubDir0Name = newSubDir0.dirName
      const newSubDir1Name = newSubDir1.dirName

      if (newSubDir0Name !== this.constructor.name + '_0_0')
        throw `1-2-1. 새 부모의 0번째 자식폴더 이름이 다르다. ${newSubDir0Name} !== ${this.constructor.name + '_0_0'}`
      if (newSubDir1Name !== this.constructor.name + '_0_1_0')
        throw `1-2-2. 새 부모의 1번째 자식폴더 이름이 다르다. ${newSubDir1Name} !== ${this.constructor.name + '_0_1_0'}`
      if (newSubDir0.parentDirOId !== newParentDirOId) throw `1-2-3. 이동한 폴더의 부모가 잘못 설정됨`

      // 1-3. 새 부모) 자식파일 배열 길이 확인
      if (newFileOIdsArr.length !== 1) throw `1-3. 새 부모의 자식파일이 1개가 아니라 ${newFileOIdsArr.length}개이다.`

      // 1-4. 새 부모) 자식파일 배열 내용 확인
      const newFileOId = newFileOIdsArr[0]
      const newFile = extraFileRows.fileRows[newFileOId]
      const newFileName = newFile.name
      if (newFileName !== this.constructor.name + '_0_1_0')
        throw `1-4. 새 부모의 자식파일 이름이 왜 바뀌었냐. ${newFileName} !== ${this.constructor.name + '_0_1_0'}`

      /**
       * 2. 기존 부모 디렉토리 점검
       *   2-1. 자식폴더 배열 길이 확인
       *   2-2. 자식폴더 배열 내용 확인
       *   2-3. 자식파일 배열 길이 확인
       *   2-4. 자식파일 배열 내용 확인
       */
      const oldParentDir = extraDirs.directories[oldParentDirOId]
      const oldDirOIdsArr = oldParentDir.subDirOIdsArr
      const oldFileOIdsArr = oldParentDir.fileOIdsArr

      // 2-1. 기존 부모) 자식폴더 배열 길이 확인
      if (oldDirOIdsArr.length !== 5) throw `2-1. 기존 부모의 자식폴더가 5개가 아니라 ${oldDirOIdsArr.length}개이다.`

      // 2-2. 기존 부모) 자식폴더 배열 순서 확인
      const newSequence = oldDirOIdsArr.map(dirOId => dir_0.subDirOIdsArr.indexOf(dirOId)).join(',')
      if (newSequence !== '1,2,3,4,5') throw `2-2. 기존 부모의 자식폴더 배열 순서가 다르다. ${newSequence} !== 1,2,3,4,5`

      // 2-3. 기존 부모) 자식파일 배열 길이 확인
      if (oldFileOIdsArr.length !== 1) throw `2-3. 기존 부모의 자식파일이 1개가 아니라 ${oldFileOIdsArr.length}개이다.`

      // 2-4. 기존 부모) 자식파일 배열 내용 확인
      const oldFileOId = oldFileOIdsArr[0]
      const oldFile = extraFileRows.fileRows[oldFileOId]
      const oldFileName = oldFile.name
      if (oldFileName !== this.constructor.name + '_0_0')
        throw `2-4. 기존 부모의 자식파일 이름이 왜 바뀌었냐. ${oldFileName} !== ${this.constructor.name + '_0_0'}`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _2_move_to_grandParent(db: Db, logLevel: number) {
    /**
     * 상황
     *   - Dir_0_1 을 GrandParent 의 마지막 자식(null) 으로 만든다.
     *
     * 점검사항
     *   1. 새로운 부모 폴더의 자식폴더 배열 길이
     *   2. 새로운 부모 폴더의 자식폴더 배열 내용
     *   3. 새로운 부모 폴더의 파일 배열 길이
     *
     *   4. 이동한 폴더의 부모폴더가 바뀌었나
     *
     * 점검 예외
     *   - 기존 부모 폴더의 자식 폴더 내용들
     *   - 1번째 테스트에서 이미 점검함
     */
    try {
      const {dirGrand, dir_0, jwtPayload} = this

      const parentDirOId = dirGrand.dirOId
      const moveDirOId = dir_0.subDirOIdsArr[1]
      const targetIdx = null

      const data: MoveDirectoryDataType = {moveDirOId, parentDirOId, targetIdx}

      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      /**
       * 1. 새로운 부모 폴더의 자식폴더 배열 길이
       * 2. 새로운 부모 폴더의 자식폴더 배열 내용
       * 3. 새로운 부모 폴더의 파일 배열 길이
       *
       * 4. 이동한 폴더의 부모폴더가 바뀌었나
       *
       * - 새로운 부모 폴더(GrandParent) 는 자식파일이 없다.
       */
      const newParentDir = extraDirs.directories[parentDirOId]
      const newDirOIdsArr = newParentDir.subDirOIdsArr
      const newFileOIdsArr = newParentDir.fileOIdsArr

      // 1. 새로운 부모 폴더의 자식폴더 배열 길이
      if (newDirOIdsArr.length !== 3) throw `1. 새로운 부모의 자식폴더가 3개가 아니라 ${newDirOIdsArr.length}개이다.`

      // 2. 새로운 부모 폴더의 자식폴더 배열 내용
      const grandSequence = newParentDir.subDirOIdsArr.map(dirOId => dirGrand.subDirOIdsArr.indexOf(dirOId)).join(',')
      if (grandSequence !== '0,1,-1') throw `2. 새로운 부모의 자식폴더 배열 순서가 다르다. ${grandSequence} !== 0,1,-1`

      const shouldMoveDir = extraDirs.directories[newDirOIdsArr[2]]
      if (shouldMoveDir.dirName !== this.constructor.name + '_0_1')
        throw `2-1. 이동한 폴더의 이름이 다르다. ${shouldMoveDir.dirName} !== ${this.constructor.name + '_0_1'}`

      // 3. 새로운 부모 폴더의 파일 배열 길이
      if (newFileOIdsArr.length !== 0) throw `3. 새로운 부모의 파일이 0개가 아니라 ${newFileOIdsArr.length}개이다.`

      // 4. 이동한 폴더의 부모폴더가 바뀌었나
      const newMoveDir = extraDirs.directories[moveDirOId]
      if (newMoveDir.parentDirOId !== parentDirOId)
        throw `4. 이동한 폴더의 부모폴더가 안바뀜. 원래: ${parentDirOId}, 결과값: ${newMoveDir.parentDirOId}`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _3_1_move_to_uncle_idx_0(db: Db, logLevel: number) {
    /**
     * 상황
     *   - Dir_0_2 를 Uncle(Dir_1) 의 0번째 자식으로 만든다.
     *
     * 점검사항
     *   1. 새로운 부모 폴더의 자식폴더 배열 길이
     *   2. 새로운 부모 폴더의 자식폴더 배열 내용
     *   3. 새로운 부모 폴더의 파일 배열 길이
     *   4. 새로운 부모 폴더의 파일 내용
     *   5. 이동한 폴더의 부모폴더가 바뀌었나
     *
     * 점검 예외
     *   - 기존 부모 폴더의 자식 폴더 내용들
     */
    try {
      const {dir_0, dir_1, jwtPayload} = this

      const parentDirOId = dir_1.dirOId
      const moveDirOId = dir_0.subDirOIdsArr[2]
      const targetIdx = 0

      const data: MoveDirectoryDataType = {moveDirOId, parentDirOId, targetIdx}

      const {extraDirs, extraFileRows} = await this.portService.moveDirectory(jwtPayload, data)

      /**
       * 1. 새로운 부모 폴더의 자식폴더 배열 길이
       * 2. 새로운 부모 폴더의 자식폴더 배열 내용
       * 3. 새로운 부모 폴더의 파일 배열 길이
       * 4. 새로운 부모 폴더의 파일 내용
       * 5. 이동한 폴더의 부모폴더가 바뀌었나
       */
      const {directories} = extraDirs
      const newParentDir = directories[parentDirOId]
      const newDirOIdsArr = newParentDir.subDirOIdsArr
      const newFileOIdsArr = newParentDir.fileOIdsArr

      // 1. 새로운 부모 폴더의 자식폴더 배열 길이
      if (newDirOIdsArr.length !== 4) throw `1. 새로운 부모의 자식폴더가 4개가 아니라 ${newDirOIdsArr.length}개이다.`

      // 2. 새로운 부모 폴더의 자식폴더 배열 내용
      const newSequence = newParentDir.subDirOIdsArr.map(dirOId => dir_1.subDirOIdsArr.indexOf(dirOId)).join(',')
      if (newSequence !== '-1,0,1,2') throw `2. 새로운 부모의 자식폴더 배열 순서가 다르다. ${newSequence} !== -1,0,1,2`

      const shouldMoveDir = directories[moveDirOId]
      if (shouldMoveDir.dirName !== this.constructor.name + '_0_2')
        throw `2-1. 이동한 폴더의 이름이 다르다. ${shouldMoveDir.dirName} !== ${this.constructor.name + '_0_2'}`

      // 3. 새로운 부모 폴더의 파일 배열 길이
      if (newFileOIdsArr.length !== 1) throw `3. 새로운 부모의 파일이 1개가 아니라 ${newFileOIdsArr.length}개이다.`

      // 4. 새로운 부모 폴더의 파일 내용
      const newFileOId = newFileOIdsArr[0]
      const newFile = extraFileRows.fileRows[newFileOId]
      const newFileName = newFile.name
      if (newFileName !== this.constructor.name + '_1_0')
        throw `4. 새로운 부모의 파일 이름이 왜 바뀌었냐. ${newFileName} !== ${this.constructor.name + '_1_0'}`

      // 5. 이동한 폴더의 부모폴더가 바뀌었나
      if (shouldMoveDir.parentDirOId !== parentDirOId)
        throw `5. 이동한 폴더의 부모폴더가 이상함. 원래: ${parentDirOId}, 결과값: ${shouldMoveDir.parentDirOId}`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _3_2_move_to_uncle_idx_2(db: Db, logLevel: number) {
    /**
     * 상황
     *   - Dir_0_3 를 Uncle(Dir_1) 의 2번째 자식으로 만든다.
     *
     * 점검사항
     *   1. 새로운 부모 폴더의 자식폴더 배열 길이
     *   2. 새로운 부모 폴더의 자식폴더 배열 내용
     *
     * 점검 예외
     *   - 기존 부모 폴더의 자식 폴더 내용들
     *   - 기존 테스트에서 점검했던 내용들
     */
    try {
      const {dir_0, dir_1, jwtPayload} = this

      const parentDirOId = dir_1.dirOId
      const moveDirOId = dir_0.subDirOIdsArr[3]
      const targetIdx = 2

      const data: MoveDirectoryDataType = {moveDirOId, parentDirOId, targetIdx}

      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      /**
       * 점검사항
       *   1. 새로운 부모 폴더의 자식폴더 배열 길이
       *   2. 새로운 부모 폴더의 자식폴더 배열 내용
       */
      const {directories} = extraDirs
      const newParentDir = directories[parentDirOId]
      const newDirOIdsArr = newParentDir.subDirOIdsArr

      // 1. 새로운 부모 폴더의 자식폴더 배열 길이
      if (newDirOIdsArr.length !== 5) throw `1. 새로운 부모의 자식폴더가 5개가 아니라 ${newDirOIdsArr.length}개이다.`

      // 2. 새로운 부모 폴더의 자식폴더 배열 내용
      const newSequence = newParentDir.subDirOIdsArr.map(dirOId => dir_1.subDirOIdsArr.indexOf(dirOId)).join(',')
      if (newSequence !== '-1,0,-1,1,2') throw `2. 새로운 부모의 자식폴더 배열 순서가 다르다. ${newSequence} !== -1,0,-1,1,2`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _3_3_move_to_uncle_idx_null(db: Db, logLevel: number) {
    /**
     * 상황
     *   - Dir_0_4 를 Uncle(Dir_1) 의 마지막 자식으로 만든다. (인덱스 null)
     *
     * 점검사항
     *   1. 새로운 부모 폴더의 자식폴더 배열 길이
     *   2. 새로운 부모 폴더의 자식폴더 배열 내용
     */
    try {
      const {dir_0, dir_1, jwtPayload} = this

      const parentDirOId = dir_1.dirOId
      const moveDirOId = dir_0.subDirOIdsArr[4]
      const targetIdx = null

      const data: MoveDirectoryDataType = {moveDirOId, parentDirOId, targetIdx}

      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      /**
       * 1. 새로운 부모 폴더의 자식폴더 배열 길이
       * 2. 새로운 부모 폴더의 자식폴더 배열 내용
       */

      const {directories} = extraDirs
      const newParentDir = directories[parentDirOId]
      const newDirOIdsArr = newParentDir.subDirOIdsArr

      // 1. 새로운 부모 폴더의 자식폴더 배열 길이
      if (newDirOIdsArr.length !== 6) throw `1. 새로운 부모의 자식폴더가 6개가 아니라 ${newDirOIdsArr.length}개이다.`

      // 2. 새로운 부모 폴더의 자식폴더 배열 내용
      const newSequence = newParentDir.subDirOIdsArr.map(dirOId => dir_1.subDirOIdsArr.indexOf(dirOId)).join(',')
      if (newSequence !== '-1,0,-1,1,2,-1') throw `2. 새로운 부모의 자식폴더 배열 순서가 다르다. ${newSequence} !== -1,0,-1,1,2,-1`

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
  const testModule = new ChangeParents(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
