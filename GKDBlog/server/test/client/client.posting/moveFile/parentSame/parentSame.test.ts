/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientPortServiceTest} from '@modules/index'
import {AddDirectoryDataType, AddFileDataType, DirectoryType, JwtPayloadType, MoveFileDataType} from '@common/types'
import {AUTH_ADMIN} from '@common/secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 같은 부모 내에서 인덱스만 바뀌는 경우를 테스트한다.
 * - 여러 서브 테스트틑 검증해야 한다.
 * - testOK 로 실행한다.
 *
 * 테스트 준비
 * - 루트 디렉토리에 폴더 하나 추가
 * - 폴더 내에 자식폴더 3개 추가
 * - 폴더 내에 파일 5개 추가
 *
 * 서브 테스트
 * 1-1. 0번째에서 2번째로 이동
 * 1-2. 2번째에서 0번째로 이동
 * 2-1. 2번째에서 마지막으로 이동
 * 2-2. 마지막에서 2번째로 이동
 * 3-1. 마지막에서 0번째로 이동
 * 3-2. 0번째에서 마지막으로 이동
 */
export class ParentSame extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private jwtPayload: JwtPayloadType
  private parentDirOId: string
  private parentDir: DirectoryType

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

      const {directory: rootDir} = this.testDB.getRootDir()
      const parentDirOId = rootDir.dirOId

      // 1. 루트에 부모 폴더 생성
      const dataRoot: AddDirectoryDataType = {parentDirOId, dirName: this.constructor.name}

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, dataRoot)
      const {dirOIdsArr, directories} = extraDirs

      this.parentDirOId = dirOIdsArr.filter(dirOId => directories[dirOId].dirName === this.constructor.name)[0]

      // 2. 부모 폴더에 자식폴더 3개 생성
      for (let i = 0; i < 3; i++) {
        const dataDir: AddDirectoryDataType = {parentDirOId: this.parentDirOId, dirName: this.constructor.name + `_${i}`}
        await this.portService.addDirectory(jwtPayload, dataDir)
      }

      // 3. 부모 폴더에 파일 5개 생성
      for (let i = 0; i < 5; i++) {
        const dataFile: AddFileDataType = {parentDirOId: this.parentDirOId, fileName: this.constructor.name + `_${i}`}
        const {extraDirs} = await this.portService.addFile(jwtPayload, dataFile)

        this.parentDir = extraDirs.directories[this.parentDirOId]
      }

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._1_1_move_0_to_2.bind(this), db, logLevel)
      await this.memberOK(this._1_2_move_2_to_0.bind(this), db, logLevel)
      await this.memberOK(this._2_1_move_2_to_last.bind(this), db, logLevel)
      await this.memberOK(this._2_2_move_last_to_2.bind(this), db, logLevel)
      await this.memberOK(this._3_1_move_last_to_0.bind(this), db, logLevel)
      await this.memberOK(this._3_2_move_0_to_last.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      for (let i = 0; i < 5; i++) {
        await this.db.collection('filedbs').deleteOne({name: this.constructor.name + `_${i}`})
      }
      for (let i = 0; i < 3; i++) {
        await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + `_${i}`})
      }
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name})

      await this.testDB.resetBaseDB()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_1_move_0_to_2(db: Db, logLevel: number) {
    /**
     * 0번째 파일을 2번째로 이동한다.
     *
     * 점검사항
     * 1. extraDirs 체크
     *   1-1. 부모폴더 잘 들어왔나
     *   1-2. 부모폴더 0번째로 들어왔나
     *   1-3. 부모폴더 폴더 배열 길이
     *   1-4. 부모폴더 폴더 배열 순서
     *   1-5. 부모폴더 파일배열 길이
     *   1-6. 부모폴더 파일배열 순서
     *
     * 2. extraFileRows 체크
     *   2-1. 파일 배열 길이
     *   2-2. 파일 배열 순서
     *   2-3. 파일 객체 내용
     */
    try {
      const {jwtPayload, parentDir, parentDirOId} = this

      const {fileOIdsArr} = parentDir

      const moveFileOId = fileOIdsArr[0]
      const targetDirOId = parentDirOId
      const targetIdx = 2

      const data: MoveFileDataType = {
        moveFileOId,
        targetDirOId,
        targetIdx
      }
      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

      /**
       * 1. extraDirs 체크
       *   1-1. 부모폴더 잘 들어왔나
       *   1-2. 부모폴더 0번째로 들어왔나
       *   1-3. 부모폴더 폴더 배열 길이
       *   1-4. 부모폴더 폴더 배열 순서
       *   1-5. 부모폴더 파일배열 길이
       *   1-6. 부모폴더 파일배열 순서
       */
      const {dirOIdsArr, directories} = extraDirs

      // 1-1. 부모폴더 잘 들어왔나
      const _parentDir = directories[parentDirOId]
      if (!_parentDir) throw `1-1. 부모 폴더가 안들어왔어요`

      // 1-2. 부모폴더 0번째로 들어왔나
      if (dirOIdsArr[0] !== parentDirOId) throw `1-2. 부모폴더가 0번째가 아닌 ${dirOIdsArr[0]} 로 들어왔어요`

      // 1-3. 부모폴더 폴더 배열 길이
      if (_parentDir.subDirOIdsArr.length !== 3) throw `1-3. 부모폴더 폴더 배열 길이가 3이 아닌 ${_parentDir.subDirOIdsArr.length} 로 들어왔어요`

      // 1-4. 부모폴더 폴더 배열 순서
      const sequenceDir = []
      _parentDir.subDirOIdsArr.forEach(dirOId => {
        sequenceDir.push(parentDir.subDirOIdsArr.indexOf(dirOId))
      })
      const dirString = sequenceDir.join(',')
      if (dirString !== '0,1,2') throw `1-4. 부모폴더 폴더 배열 순서가 0,1,2 가 아닌 ${dirString} 로 들어왔어요`

      // 1-5. 부모폴더 파일배열 길이
      if (_parentDir.fileOIdsArr.length !== 5) throw `1-5. 부모폴더 파일배열 길이가 5이 아닌 ${_parentDir.fileOIdsArr.length} 로 들어왔어요`

      // 1-6. 부모폴더 파일배열 순서
      const sequenceFile = []
      _parentDir.fileOIdsArr.forEach(fileOId => {
        sequenceFile.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString = sequenceFile.join(',')
      if (fileString !== '1,2,0,3,4') throw `1-6. 부모폴더 파일배열 순서가 1,2,0,3,4 가 아닌 ${fileString} 로 들어왔어요`

      /**
       * 2. extraFileRows 체크
       *   2-1. 파일 배열 길이
       *   2-2. 파일 배열 순서
       *   2-3. 파일 객체 내용
       */
      const {fileOIdsArr: _fileOIdsArr, fileRows: _fileRows} = extraFileRows

      // 2-1. 파일 배열 길이
      if (_fileOIdsArr.length !== 5) throw `2-1. 파일 배열 길이가 5이 아닌 ${_fileOIdsArr.length} 로 들어왔어요`

      // 2-2. 파일 배열 순서
      const sequenceFile2 = []
      _fileOIdsArr.forEach(fileOId => {
        sequenceFile2.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString2 = sequenceFile2.join(',')
      if (fileString2 !== '1,2,0,3,4') throw `2-2. 파일 배열 순서가 1,2,0,3,4 가 아닌 ${fileString2} 로 들어왔어요`

      // 2-3. 파일 객체 내용
      for (let i = 0; i < 5; i++) {
        const _fileOId = _fileOIdsArr[i]
        const fileRow = _fileRows[_fileOId]
        if (!fileRow) throw `2-3. ${i}번째 파일이 안들어왔어요.`
      }

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_2_move_2_to_0(db: Db, logLevel: number) {
    /**
     * 2번째 파일을 0번째로 이동한다. (기존 0번째 파일을 이동한다)
     *
     * 점검사항
     * 1. extraDirs 체크
     *   1-1. 부모폴더 잘 들어왔나
     *   1-2. 부모폴더 0번째로 들어왔나
     *   1-3. 부모폴더 폴더 배열 길이
     *   1-4. 부모폴더 폴더 배열 순서
     *   1-5. 부모폴더 파일배열 길이
     *   1-6. 부모폴더 파일배열 순서
     *
     * 2. extraFileRows 체크
     *   2-1. 파일 배열 길이
     *   2-2. 파일 배열 순서
     *   2-3. 파일 객체 내용
     */
    try {
      const {jwtPayload, parentDir, parentDirOId} = this

      const {fileOIdsArr} = parentDir
      const moveFileOId = fileOIdsArr[0]
      const targetDirOId = parentDirOId
      const targetIdx = 0

      const data: MoveFileDataType = {
        moveFileOId,
        targetDirOId,
        targetIdx
      }
      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

      /**
       * 1. extraDirs 체크
       *   1-1. 부모폴더 잘 들어왔나
       *   1-2. 부모폴더 0번째로 들어왔나
       *   1-3. 부모폴더 폴더 배열 길이
       *   1-4. 부모폴더 폴더 배열 순서
       *   1-5. 부모폴더 파일배열 길이
       *   1-6. 부모폴더 파일배열 순서
       */
      const {dirOIdsArr: _dirOIdsArr, directories: _directories} = extraDirs

      // 1-1. 부모폴더 잘 들어왔나
      const _parentDir = _directories[parentDirOId]
      if (!_parentDir) throw `1-1. 부모 폴더가 안들어왔어요`

      // 1-2. 부모폴더 0번째로 들어왔나
      if (_dirOIdsArr[0] !== parentDirOId) throw `1-2. 부모폴더가 0번째가 아닌 ${_dirOIdsArr[0]} 로 들어왔어요`

      // 1-3. 부모폴더 폴더 배열 길이
      if (_parentDir.subDirOIdsArr.length !== 3) throw `1-3. 부모폴더 폴더 배열 길이가 3이 아닌 ${_parentDir.subDirOIdsArr.length} 로 들어왔어요`

      // 1-4. 부모폴더 폴더 배열 순서
      const sequenceDir = []
      _parentDir.subDirOIdsArr.forEach(dirOId => {
        sequenceDir.push(parentDir.subDirOIdsArr.indexOf(dirOId))
      })
      const dirString = sequenceDir.join(',')
      if (dirString !== '0,1,2') throw `1-4. 부모폴더 폴더 배열 순서가 0,1,2 가 아닌 ${dirString} 로 들어왔어요`

      // 1-5. 부모폴더 파일배열 길이
      if (_parentDir.fileOIdsArr.length !== 5) throw `1-5. 부모폴더 파일배열 길이가 5이 아닌 ${_parentDir.fileOIdsArr.length} 로 들어왔어요`

      // 1-6. 부모폴더 파일배열 순서
      const sequenceFile = []
      _parentDir.fileOIdsArr.forEach(fileOId => {
        sequenceFile.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString = sequenceFile.join(',')
      if (fileString !== '0,1,2,3,4') throw `1-6. 부모폴더 파일배열 순서가 0,1,2,3,4 가 아닌 ${fileString} 로 들어왔어요`

      /**
       * 2. extraFileRows 체크
       *   2-1. 파일 배열 길이
       *   2-2. 파일 배열 순서
       *   2-3. 파일 객체 내용
       */
      const {fileOIdsArr: _fileOIdsArr, fileRows: _fileRows} = extraFileRows

      // 2-1. 파일 배열 길이
      if (_fileOIdsArr.length !== 5) throw `2-1. 파일 배열 길이가 5이 아닌 ${_fileOIdsArr.length} 로 들어왔어요`

      // 2-2. 파일 배열 순서
      const sequenceFile2 = []
      _fileOIdsArr.forEach(fileOId => {
        sequenceFile2.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString2 = sequenceFile2.join(',')
      if (fileString2 !== '0,1,2,3,4') throw `2-2. 파일 배열 순서가 0,1,2,3,4 가 아닌 ${fileString2} 로 들어왔어요`

      // 2-3. 파일 객체 내용
      for (let i = 0; i < 5; i++) {
        const _fileOId = _fileOIdsArr[i]
        const fileRow = _fileRows[_fileOId]
        if (!fileRow) throw `2-3. ${i}번째 파일이 안들어왔어요.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_1_move_2_to_last(db: Db, logLevel: number) {
    /**
     * 2번째 파일을 마지막으로 이동한다.
     *
     * 점검사항
     * 1. extraDirs 체크
     *   1-1. 부모폴더 잘 들어왔나
     *   1-2. 부모폴더 0번째로 들어왔나
     *   1-3. 부모폴더 폴더 배열 길이
     *   1-4. 부모폴더 폴더 배열 순서
     *   1-5. 부모폴더 파일배열 길이
     *   1-6. 부모폴더 파일배열 순서
     *
     * 2. extraFileRows 체크
     *   2-1. 파일 배열 길이
     *   2-2. 파일 배열 순서
     *   2-3. 파일 객체 내용
     */
    try {
      // ::
      const {jwtPayload, parentDir, parentDirOId} = this

      const {fileOIdsArr} = parentDir
      const moveFileOId = fileOIdsArr[2]
      const targetDirOId = parentDirOId
      const targetIdx = null

      const data: MoveFileDataType = {
        moveFileOId,
        targetDirOId,
        targetIdx
      }
      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

      /**
       * 1. extraDirs 체크
       *   1-1. 부모폴더 잘 들어왔나
       *   1-2. 부모폴더 0번째로 들어왔나
       *   1-3. 부모폴더 폴더 배열 길이
       *   1-4. 부모폴더 폴더 배열 순서
       *   1-5. 부모폴더 파일배열 길이
       *   1-6. 부모폴더 파일배열 순서
       */
      const {dirOIdsArr: _dirOIdsArr, directories: _directories} = extraDirs

      // 1-1. 부모폴더 잘 들어왔나
      const _parentDir = _directories[parentDirOId]
      if (!_parentDir) throw `1-1. 부모 폴더가 안들어왔어요`

      // 1-2. 부모폴더 0번째로 들어왔나
      if (_dirOIdsArr[0] !== parentDirOId) throw `1-2. 부모폴더가 0번째가 아닌 ${_dirOIdsArr[0]} 로 들어왔어요`

      // 1-3. 부모폴더 폴더 배열 길이
      if (_parentDir.subDirOIdsArr.length !== 3) throw `1-3. 부모폴더 폴더 배열 길이가 3이 아닌 ${_parentDir.subDirOIdsArr.length} 로 들어왔어요`

      // 1-4. 부모폴더 폴더 배열 순서
      const sequenceDir = []
      _parentDir.subDirOIdsArr.forEach(dirOId => {
        sequenceDir.push(parentDir.subDirOIdsArr.indexOf(dirOId))
      })
      const dirString = sequenceDir.join(',')
      if (dirString !== '0,1,2') throw `1-4. 부모폴더 폴더 배열 순서가 0,1,2 가 아닌 ${dirString} 로 들어왔어요`

      // 1-5. 부모폴더 파일배열 길이
      if (_parentDir.fileOIdsArr.length !== 5) throw `1-5. 부모폴더 파일배열 길이가 5이 아닌 ${_parentDir.fileOIdsArr.length} 로 들어왔어요`

      // 1-6. 부모폴더 파일배열 순서
      const sequenceFile = []
      _parentDir.fileOIdsArr.forEach(fileOId => {
        sequenceFile.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString = sequenceFile.join(',')
      if (fileString !== '0,1,3,4,2') throw `1-6. 부모폴더 파일배열 순서가 0,1,3,4,2 가 아닌 ${fileString} 로 들어왔어요`

      /**
       * 2. extraFileRows 체크
       *   2-1. 파일 배열 길이
       *   2-2. 파일 배열 순서
       *   2-3. 파일 객체 내용
       */
      const {fileOIdsArr: _fileOIdsArr, fileRows: _fileRows} = extraFileRows

      // 2-1. 파일 배열 길이
      if (_fileOIdsArr.length !== 5) throw `2-1. 파일 배열 길이가 5이 아닌 ${_fileOIdsArr.length} 로 들어왔어요`

      // 2-2. 파일 배열 순서
      const sequenceFile2 = []
      _fileOIdsArr.forEach(fileOId => {
        sequenceFile2.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString2 = sequenceFile2.join(',')
      if (fileString2 !== '0,1,3,4,2') throw `2-2. 파일 배열 순서가 0,1,3,4,2 가 아닌 ${fileString2} 로 들어왔어요`

      // 2-3. 파일 객체 내용
      for (let i = 0; i < 5; i++) {
        const _fileOId = _fileOIdsArr[i]
        const fileRow = _fileRows[_fileOId]
        if (!fileRow) throw `2-3. ${i}번째 파일이 안들어왔어요.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_2_move_last_to_2(db: Db, logLevel: number) {
    /**
     * 마지막 파일을 2번째로 이동한다.
     *
     * 점검사항
     * 1. extraDirs 체크
     *   1-1. 부모폴더 잘 들어왔나
     *   1-2. 부모폴더 0번째로 들어왔나
     *   1-3. 부모폴더 폴더 배열 길이
     *   1-4. 부모폴더 폴더 배열 순서
     *   1-5. 부모폴더 파일배열 길이
     *   1-6. 부모폴더 파일배열 순서
     * 2. extraFileRows 체크
     *   2-1. 파일 배열 길이
     *   2-2. 파일 배열 순서
     *   2-3. 파일 객체 내용
     */
    try {
      const {jwtPayload, parentDir, parentDirOId} = this

      const {fileOIdsArr} = parentDir
      const moveFileOId = fileOIdsArr[2]
      const targetDirOId = parentDirOId
      const targetIdx = 2

      const data: MoveFileDataType = {
        moveFileOId,
        targetDirOId,
        targetIdx
      }
      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

      /**
       * 1. extraDirs 체크
       *   1-1. 부모폴더 잘 들어왔나
       *   1-2. 부모폴더 0번째로 들어왔나
       *   1-3. 부모폴더 폴더 배열 길이
       *   1-4. 부모폴더 폴더 배열 순서
       *   1-5. 부모폴더 파일배열 길이
       *   1-6. 부모폴더 파일배열 순서
       */
      const {dirOIdsArr: _dirOIdsArr, directories: _directories} = extraDirs

      // 1-1. 부모폴더 잘 들어왔나
      const _parentDir = _directories[parentDirOId]
      if (!_parentDir) throw `1-1. 부모 폴더가 안들어왔어요`

      // 1-2. 부모폴더 0번째로 들어왔나
      if (_dirOIdsArr[0] !== parentDirOId) throw `1-2. 부모폴더가 0번째가 아닌 ${_dirOIdsArr[0]} 로 들어왔어요`

      // 1-3. 부모폴더 폴더 배열 길이
      if (_parentDir.subDirOIdsArr.length !== 3) throw `1-3. 부모폴더 폴더 배열 길이가 3이 아닌 ${_parentDir.subDirOIdsArr.length} 로 들어왔어요`

      // 1-4. 부모폴더 폴더 배열 순서
      const sequenceDir = []
      _parentDir.subDirOIdsArr.forEach(dirOId => {
        sequenceDir.push(parentDir.subDirOIdsArr.indexOf(dirOId))
      })
      const dirString = sequenceDir.join(',')
      if (dirString !== '0,1,2') throw `1-4. 부모폴더 폴더 배열 순서가 0,1,2 가 아닌 ${dirString} 로 들어왔어요`

      // 1-5. 부모폴더 파일배열 길이
      if (_parentDir.fileOIdsArr.length !== 5) throw `1-5. 부모폴더 파일배열 길이가 5이 아닌 ${_parentDir.fileOIdsArr.length} 로 들어왔어요`

      // 1-6. 부모폴더 파일배열 순서
      const sequenceFile = []
      _parentDir.fileOIdsArr.forEach(fileOId => {
        sequenceFile.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString = sequenceFile.join(',')
      if (fileString !== '0,1,2,3,4') throw `1-6. 부모폴더 파일배열 순서가 0,1,2,3,4 가 아닌 ${fileString} 로 들어왔어요`

      /**
       * 2. extraFileRows 체크
       *   2-1. 파일 배열 길이
       *   2-2. 파일 배열 순서
       *   2-3. 파일 객체 내용
       */
      const {fileOIdsArr: _fileOIdsArr, fileRows: _fileRows} = extraFileRows

      // 2-1. 파일 배열 길이
      if (_fileOIdsArr.length !== 5) throw `2-1. 파일 배열 길이가 5이 아닌 ${_fileOIdsArr.length} 로 들어왔어요`

      // 2-2. 파일 배열 순서
      const sequenceFile2 = []
      _fileOIdsArr.forEach(fileOId => {
        sequenceFile2.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString2 = sequenceFile2.join(',')
      if (fileString2 !== '0,1,2,3,4') throw `2-2. 파일 배열 순서가 0,1,2,3,4 가 아닌 ${fileString2} 로 들어왔어요`

      // 2-3. 파일 객체 내용
      for (let i = 0; i < 5; i++) {
        const _fileOId = _fileOIdsArr[i]
        const fileRow = _fileRows[_fileOId]
        if (!fileRow) throw `2-3. ${i}번째 파일이 안들어왔어요.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_1_move_last_to_0(db: Db, logLevel: number) {
    /**
     * 마지막 파일을 0번째로 이동한다.
     *
     * 점검사항
     * 1. extraDirs 체크
     *   1-1. 부모폴더 잘 들어왔나
     *   1-2. 부모폴더 0번째로 들어왔나
     *   1-3. 부모폴더 폴더 배열 길이
     *   1-4. 부모폴더 폴더 배열 순서
     *   1-5. 부모폴더 파일배열 길이
     *   1-6. 부모폴더 파일배열 순서
     * 2. extraFileRows 체크
     *   2-1. 파일 배열 길이
     *   2-2. 파일 배열 순서
     *   2-3. 파일 객체 내용
     */
    try {
      const {jwtPayload, parentDir, parentDirOId} = this

      const {fileOIdsArr} = parentDir
      const moveFileOId = fileOIdsArr[4]
      const targetDirOId = parentDirOId
      const targetIdx = 0

      const data: MoveFileDataType = {
        moveFileOId,
        targetDirOId,
        targetIdx
      }
      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

      /**
       * 1. extraDirs 체크
       *   1-1. 부모폴더 잘 들어왔나
       *   1-2. 부모폴더 0번째로 들어왔나
       *   1-3. 부모폴더 폴더 배열 길이
       *   1-4. 부모폴더 폴더 배열 순서
       *   1-5. 부모폴더 파일배열 길이
       *   1-6. 부모폴더 파일배열 순서
       */
      const {dirOIdsArr: _dirOIdsArr, directories: _directories} = extraDirs

      // 1-1. 부모폴더 잘 들어왔나
      const _parentDir = _directories[parentDirOId]
      if (!_parentDir) throw `1-1. 부모 폴더가 안들어왔어요`

      // 1-2. 부모폴더 0번째로 들어왔나
      if (_dirOIdsArr[0] !== parentDirOId) throw `1-2. 부모폴더가 0번째가 아닌 ${_dirOIdsArr[0]} 로 들어왔어요`

      // 1-3. 부모폴더 폴더 배열 길이
      if (_parentDir.subDirOIdsArr.length !== 3) throw `1-3. 부모폴더 폴더 배열 길이가 3이 아닌 ${_parentDir.subDirOIdsArr.length} 로 들어왔어요`

      // 1-4. 부모폴더 폴더 배열 순서
      const sequenceDir = []
      _parentDir.subDirOIdsArr.forEach(dirOId => {
        sequenceDir.push(parentDir.subDirOIdsArr.indexOf(dirOId))
      })
      const dirString = sequenceDir.join(',')
      if (dirString !== '0,1,2') throw `1-4. 부모폴더 폴더 배열 순서가 0,1,2 가 아닌 ${dirString} 로 들어왔어요`

      // 1-5. 부모폴더 파일배열 길이
      if (_parentDir.fileOIdsArr.length !== 5) throw `1-5. 부모폴더 파일배열 길이가 5이 아닌 ${_parentDir.fileOIdsArr.length} 로 들어왔어요`

      // 1-6. 부모폴더 파일배열 순서
      const sequenceFile = []
      _parentDir.fileOIdsArr.forEach(fileOId => {
        sequenceFile.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString = sequenceFile.join(',')
      if (fileString !== '4,0,1,2,3') throw `1-6. 부모폴더 파일배열 순서가 4,0,1,2,3 가 아닌 ${fileString} 로 들어왔어요`

      /**
       * 2. extraFileRows 체크
       *   2-1. 파일 배열 길이
       *   2-2. 파일 배열 순서
       *   2-3. 파일 객체 내용
       */
      const {fileOIdsArr: _fileOIdsArr, fileRows: _fileRows} = extraFileRows

      // 2-1. 파일 배열 길이
      if (_fileOIdsArr.length !== 5) throw `2-1. 파일 배열 길이가 5이 아닌 ${_fileOIdsArr.length} 로 들어왔어요`

      // 2-2. 파일 배열 순서
      const sequenceFile2 = []
      _fileOIdsArr.forEach(fileOId => {
        sequenceFile2.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString2 = sequenceFile2.join(',')
      if (fileString2 !== '4,0,1,2,3') throw `2-2. 파일 배열 순서가 4,0,1,2,3 가 아닌 ${fileString2} 로 들어왔어요`

      // 2-3. 파일 객체 내용
      for (let i = 0; i < 5; i++) {
        const _fileOId = _fileOIdsArr[i]
        const fileRow = _fileRows[_fileOId]
        if (!fileRow) throw `2-3. ${i}번째 파일이 안들어왔어요.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_2_move_0_to_last(db: Db, logLevel: number) {
    /**
     * 0번째 파일을 마지막으로 이동한다.
     *
     * 점검사항
     * 1. extraDirs 체크
     *   1-1. 부모폴더 잘 들어왔나
     *   1-2. 부모폴더 0번째로 들어왔나
     *   1-3. 부모폴더 폴더 배열 길이
     *   1-4. 부모폴더 폴더 배열 순서
     *   1-5. 부모폴더 파일배열 길이
     *   1-6. 부모폴더 파일배열 순서
     * 2. extraFileRows 체크
     *   2-1. 파일 배열 길이
     *   2-2. 파일 배열 순서
     *   2-3. 파일 객체 내용
     */
    try {
      // ::
      const {jwtPayload, parentDir, parentDirOId} = this

      const {fileOIdsArr} = parentDir
      const moveFileOId = fileOIdsArr[4]
      const targetDirOId = parentDirOId
      const targetIdx = null

      const data: MoveFileDataType = {
        moveFileOId,
        targetDirOId,
        targetIdx
      }
      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

      /**
       * 1. extraDirs 체크
       *   1-1. 부모폴더 잘 들어왔나
       *   1-2. 부모폴더 0번째로 들어왔나
       *   1-3. 부모폴더 폴더 배열 길이
       *   1-4. 부모폴더 폴더 배열 순서
       *   1-5. 부모폴더 파일배열 길이
       *   1-6. 부모폴더 파일배열 순서
       */
      const {dirOIdsArr: _dirOIdsArr, directories: _directories} = extraDirs

      // 1-1. 부모폴더 잘 들어왔나
      const _parentDir = _directories[parentDirOId]
      if (!_parentDir) throw `1-1. 부모 폴더가 안들어왔어요`

      // 1-2. 부모폴더 0번째로 들어왔나
      if (_dirOIdsArr[0] !== parentDirOId) throw `1-2. 부모폴더가 0번째가 아닌 ${_dirOIdsArr[0]} 로 들어왔어요`

      // 1-3. 부모폴더 폴더 배열 길이
      if (_parentDir.subDirOIdsArr.length !== 3) throw `1-3. 부모폴더 폴더 배열 길이가 3이 아닌 ${_parentDir.subDirOIdsArr.length} 로 들어왔어요`

      // 1-4. 부모폴더 폴더 배열 순서
      const sequenceDir = []
      _parentDir.subDirOIdsArr.forEach(dirOId => {
        sequenceDir.push(parentDir.subDirOIdsArr.indexOf(dirOId))
      })
      const dirString = sequenceDir.join(',')
      if (dirString !== '0,1,2') throw `1-4. 부모폴더 폴더 배열 순서가 0,1,2 가 아닌 ${dirString} 로 들어왔어요`

      // 1-5. 부모폴더 파일배열 길이
      if (_parentDir.fileOIdsArr.length !== 5) throw `1-5. 부모폴더 파일배열 길이가 5이 아닌 ${_parentDir.fileOIdsArr.length} 로 들어왔어요`

      // 1-6. 부모폴더 파일배열 순서
      const sequenceFile = []
      _parentDir.fileOIdsArr.forEach(fileOId => {
        sequenceFile.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString = sequenceFile.join(',')
      if (fileString !== '0,1,2,3,4') throw `1-6. 부모폴더 파일배열 순서가 0,1,2,3,4 가 아닌 ${fileString} 로 들어왔어요`

      /**
       * 2. extraFileRows 체크
       *   2-1. 파일 배열 길이
       *   2-2. 파일 배열 순서
       *   2-3. 파일 객체 내용
       */
      const {fileOIdsArr: _fileOIdsArr, fileRows: _fileRows} = extraFileRows

      // 2-1. 파일 배열 길이
      if (_fileOIdsArr.length !== 5) throw `2-1. 파일 배열 길이가 5이 아닌 ${_fileOIdsArr.length} 로 들어왔어요`

      // 2-2. 파일 배열 순서
      const sequenceFile2 = []
      _fileOIdsArr.forEach(fileOId => {
        sequenceFile2.push(parentDir.fileOIdsArr.indexOf(fileOId))
      })
      const fileString2 = sequenceFile2.join(',')
      if (fileString2 !== '0,1,2,3,4') throw `2-2. 파일 배열 순서가 0,1,2,3,4 가 아닌 ${fileString2} 로 들어왔어요`

      // 2-3. 파일 객체 내용
      for (let i = 0; i < 5; i++) {
        const _fileOId = _fileOIdsArr[i]
        const fileRow = _fileRows[_fileOId]
        if (!fileRow) throw `2-3. ${i}번째 파일이 안들어왔어요.`
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
  const testModule = new ParentSame(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
