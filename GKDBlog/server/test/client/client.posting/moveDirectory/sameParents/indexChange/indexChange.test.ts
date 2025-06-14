/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {AUTH_ADMIN} from '@common/secret'
import {AddFileDataType, JwtPayloadType, MoveDirectoryDataType} from '@common/types'
import {ClientPortServiceTest} from '@modules/database'
import {DirectoryType} from '@common/types'
import {AddDirectoryDataType} from '@common/types'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 5

/**
 * moveDirectory 에서 같은 부모에서 인덱스를 변경하는 경우들을 테스트
 * - 여러 서브테스트를 통과해야 한다.
 * - testOK 로 실행
 *
 * 초기 설정
 * - 루트 디렉토리에 테스트용 부모 디렉토리를 만든다.
 * - 부모 밑에 디렉토리 5개를 만든다.
 *   + 그 밑에 각각 디렉토리를 2개씩 만든다.
 *   + 그 밑에 각각 파일을 2개씩 만든다.
 * - 부모 밑에 파일을 2개 만든다.
 *
 * 서브 테스트 (중간은 인덱스 2로 한다.)
 *   1. 중간 -> 0번째 인덱스 이동 테스트
 *     - 파일, 서브디렉토리 제대로 이동하는지는 여기서만 확인
 *   2. 0번째 -> 중간 인덱스 이동 테스트
 *   3. 중간 -> 마지막(null) 이동 테스트
 *   4. 마지막(null) -> 중간 이동 테스트
 *   5. 처음 -> 마지막(null) 이동 테스트
 *   6. 마지막(null) -> 처음 이동 테스트
 *   7. 인덱스 1 -> 인덱스 3
 *   8. 인덱스 3 -> 인덱스 1
 */
export class IndexChange extends GKDTestBase {
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
      const {userOId, userId, userName, signUpType} = user
      const jwtPayload: JwtPayloadType = {
        userOId,
        userId,
        userName,
        signUpType
      }
      this.jwtPayload = jwtPayload

      const {directory: rootDir} = this.testDB.getRootDir()
      const {dirOId: rootDirOId} = rootDir

      // 테스트용 부모 디렉토리를 만든다.
      const data: AddDirectoryDataType = {
        dirName: this.constructor.name,
        parentDirOId: rootDirOId
      }
      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs
      const parentDirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === this.constructor.name)[0]
      this.parentDirOId = parentDirOId

      // 테스트용 디렉토리들을 넣어줄 객체
      let _directories = {}

      // 테스트용 디렉토리 5개를 만든다.
      for (let i = 0; i < 5; i++) {
        const data: AddDirectoryDataType = {
          dirName: this.constructor.name + `_${i}`,
          parentDirOId
        }
        const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

        this.parentDir = extraDirs.directories[parentDirOId]
        _directories = extraDirs.directories
      }

      // 테스트용 디렉토리가 순서대로 잘 들어갔나 확인한다.
      for (let i = 0; i < 5; i++) {
        const dirOId = this.parentDir.subDirOIdsArr[i]
        const dir = _directories[dirOId]
        if (dir.dirName !== this.constructor.name + `_${i}`)
          throw `before: ${i}번째 디렉토리 이름이 이상해요. ${dir.dirName} !== ${this.constructor.name + `_${i}`}`
      }

      // 자식 폴더들에 디렉토리 2개씩 만든다.
      for (let i = 0; i < 5; i++) {
        const dirOId = this.parentDir.subDirOIdsArr[i]
        const dir = _directories[dirOId]
        for (let j = 0; j < 2; j++) {
          const data: AddDirectoryDataType = {
            dirName: this.constructor.name + `_${i}_${j}`,
            parentDirOId: dirOId
          }
          await this.portService.addDirectory(jwtPayload, data)
        }
      }

      // 자식 폴더들에 파일 2개씩 만든다.
      for (let i = 0; i < 5; i++) {
        const dirOId = this.parentDir.subDirOIdsArr[i]
        const dir = _directories[dirOId]
        for (let j = 0; j < 2; j++) {
          const data: AddFileDataType = {
            fileName: this.constructor.name + `_${i}_${j}`,
            parentDirOId: dirOId
          }
          await this.portService.addFile(jwtPayload, data)
        }
      }

      // 부모 밑에 파일 2개 만든다.
      for (let i = 0; i < 2; i++) {
        const data: AddFileDataType = {
          fileName: this.constructor.name + `_${i}`,
          parentDirOId: this.parentDirOId
        }
        const {extraDirs} = await this.portService.addFile(jwtPayload, data)

        // 여기서도 해줘야 부모폴더의 파일들을 기억할 수 있다.
        this.parentDir = extraDirs.directories[parentDirOId]
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberOK(this._1_middle_to_index_0.bind(this), db, logLevel)
      await this.memberOK(this._2_index_0_to_middle.bind(this), db, logLevel)
      await this.memberOK(this._3_middle_to_last.bind(this), db, logLevel)
      await this.memberOK(this._4_last_to_middle.bind(this), db, logLevel)
      await this.memberOK(this._5_first_to_last.bind(this), db, logLevel)
      await this.memberOK(this._6_last_to_first.bind(this), db, logLevel)
      await this.memberOK(this._7_first_to_middle.bind(this), db, logLevel)
      await this.memberOK(this._8_middle_to_first.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name})
      for (let i = 0; i < 5; i++) {
        await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + `_${i}`})
        for (let j = 0; j < 2; j++) {
          await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + `_${i}_${j}`})
          await this.db.collection('filedbs').deleteOne({name: this.constructor.name + `_${i}_${j}`})
        }
      }
      for (let i = 0; i < 2; i++) {
        await this.db.collection('filedbs').deleteOne({name: this.constructor.name + `_${i}`})
      }
      await this.testDB.resetBaseDB()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_middle_to_index_0(db: Db, logLevel: number) {
    /**
     * 2번째 자식폴더를 0번째로 이동한다.
     * - 자식 폴더 순서가 01234 에서 20134 로 바뀐다.
     *
     * 점검사항
     * 1-1. 부모폴더: extraDirs 에 들어왔는가
     * 1-2. 부모폴더: 자식폴더 배열 순서 올바른가
     * 1-3. 부모폴더: 자식폴더들 extraDirs 에 잘 들어왔는가
     *
     * 2-1. 부모폴더: 자식 파일 배열 순서 올바른가
     * 2-2. 부모폴더: 자식 파일들 extraFileRows 에 잘 들어왔는가
     *
     * NOTE: 이동하는 폴더는 여기서 정보가 바뀌지 않기 때문에 디렉토리 정보를 리턴받지 않는다.
     */
    try {
      const {jwtPayload, parentDirOId, parentDir} = this

      const moveDirOId = parentDir.subDirOIdsArr[2]

      const data: MoveDirectoryDataType = {
        moveDirOId,
        parentDirOId,
        targetIdx: 0
      }
      const {extraDirs, extraFileRows} = await this.portService.moveDirectory(jwtPayload, data)

      const {directories} = extraDirs

      // 1-1. 부모폴더: extraDirs 에 들어왔는가
      const _parentDir = directories[parentDirOId]
      if (!_parentDir) throw `1-1. 부모폴더: extraDirs 에 안 들어왔어요`

      // 1-2. 부모폴더: 자식폴더 배열 순서 올바른가
      const _parentSubDirArr = _parentDir.subDirOIdsArr
      if (_parentSubDirArr.length !== 5) throw `1-2. 부모폴더: 자식폴더 갯수가 5개가 아니라 ${_parentSubDirArr.length} 개야`

      const _parentSequence = [] // 리턴받은 자식들의 원래 인덱스를 순서대로 저장한다.
      for (let i = 0; i < 5; i++) {
        _parentSequence.push(parentDir.subDirOIdsArr.indexOf(_parentSubDirArr[i]))
      }
      if (_parentSequence.join(',') !== '2,0,1,3,4') throw `1-2. 부모폴더: 자식폴더 순서가 2,0,1,3,4 가 아니라 ${_parentSequence.join(',')} 가 됬음`

      // 1-3. 부모폴더: 자식폴더들 extraDirs 에 잘 들어왔는가
      for (let i = 0; i < 5; i++) {
        const _subDirOId = parentDir.subDirOIdsArr[i]
        const _subDir = directories[_subDirOId]
        if (!_subDir) throw `1-3. 부모폴더: ${i}번째 자식폴더 extraDirs 에 안들어옴`
      }

      // 2-1. 부모폴더: 자식 파일 배열 순서 올바른가
      const _parentSubFileArr = _parentDir.fileOIdsArr
      if (_parentSubFileArr.length !== 2) throw `2-1. 부모폴더: 자식 파일 갯수가 2개가 아니라 ${_parentSubFileArr.length} 개야`

      const _parentFileSequence = [] // 리턴받은 자식들의 원래 인덱스를 순서대로 저장한다.
      for (let i = 0; i < 2; i++) {
        _parentFileSequence.push(parentDir.fileOIdsArr.indexOf(_parentSubFileArr[i]))
      }
      if (_parentFileSequence.join(',') !== '0,1') throw `2-1. 부모폴더: 자식 파일 순서가 0,1 이 아니라 ${_parentFileSequence.join(',')} 가 됬음`

      // 2-2. 부모폴더: 자식 파일들 extraFileRows 에 잘 들어왔는가
      for (let i = 0; i < 2; i++) {
        const _subFileOId = parentDir.fileOIdsArr[i]
        const _subFileRow = extraFileRows.fileRows[_subFileOId]
        if (!_subFileRow) throw `2-2. 부모폴더: ${i}번째 자식 파일 extraFileRows 에 안들어옴`
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _2_index_0_to_middle(db: Db, logLevel: number) {
    /**
     * 0번째 자식폴더를 2번째로 이동한다.
     * - 자식 폴더 순서가 20134 에서 01234 로 바뀐다.
     */
    try {
      const {jwtPayload, parentDirOId, parentDir} = this
      const moveDirOId = parentDir.subDirOIdsArr[2]

      const data: MoveDirectoryDataType = {
        moveDirOId,
        parentDirOId,
        targetIdx: 2
      }
      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      const {directories} = extraDirs
      const _parentDir = directories[parentDirOId]

      // 1. 부모폴더가 extraDirs 에 잘 들어왔는지
      if (!_parentDir) throw `부모폴더: extraDirs 에 안 들어왔어요`

      // 2. 부모폴더: 자식폴더 배열 크기 올바른가
      const _parentSubDirArr = _parentDir.subDirOIdsArr
      if (_parentSubDirArr.length !== 5) throw `부모폴더: 자식폴더 갯수가 5개가 아니라 ${_parentSubDirArr.length} 개야`

      // 3. 부모폴더: 자식폴더 배열 순서 올바른가
      const _parentSequence = [] // 리턴받은 자식들의 원래 인덱스를 순서대로 저장한다.
      for (let i = 0; i < 5; i++) {
        _parentSequence.push(parentDir.subDirOIdsArr.indexOf(_parentSubDirArr[i]))
      }
      if (_parentSequence.join(',') !== '0,1,2,3,4') throw `부모폴더: 자식폴더 순서가 0,1,2,3,4 가 아니라 ${_parentSequence.join(',')} 가 됬음`

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _3_middle_to_last(db: Db, logLevel: number) {
    /**
     * 2번째 자식폴더를 마지막으로 이동한다.
     * - 자식 폴더 순서가 01234 에서 01342 로 바뀐다.
     */
    try {
      const {jwtPayload, parentDirOId, parentDir} = this
      const moveDirOId = parentDir.subDirOIdsArr[2]

      const data: MoveDirectoryDataType = {
        moveDirOId,
        parentDirOId,
        targetIdx: null
      }
      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      const {directories} = extraDirs
      const _parentDir = directories[parentDirOId]

      // 1. 부모폴더가 extraDirs 에 잘 들어왔는지
      if (!_parentDir) throw `부모폴더: extraDirs 에 안 들어왔어요`

      // 2. 부모폴더: 자식폴더 배열 크기 올바른가
      const _parentSubDirArr = _parentDir.subDirOIdsArr
      if (_parentSubDirArr.length !== 5) throw `부모폴더: 자식폴더 갯수가 5개가 아니라 ${_parentSubDirArr.length} 개야`

      // 3. 부모폴더: 자식폴더 배열 순서 올바른가
      const _parentSequence = [] // 리턴받은 자식들의 원래 인덱스를 순서대로 저장한다.
      for (let i = 0; i < 5; i++) {
        _parentSequence.push(parentDir.subDirOIdsArr.indexOf(_parentSubDirArr[i]))
      }
      if (_parentSequence.join(',') !== '0,1,3,4,2') throw `부모폴더: 자식폴더 순서가 0,1,3,4,2 가 아니라 ${_parentSequence.join(',')} 가 됬음`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _4_last_to_middle(db: Db, logLevel: number) {
    /**
     * 마지막 자식폴더를 2번째로 이동한다.
     * - 자식 폴더 순서가 01342 에서 01234 로 바뀐다.
     */
    try {
      const {jwtPayload, parentDirOId, parentDir} = this
      const moveDirOId = parentDir.subDirOIdsArr[2]

      const data: MoveDirectoryDataType = {
        moveDirOId,
        parentDirOId,
        targetIdx: 2
      }
      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      const {directories} = extraDirs
      const _parentDir = directories[parentDirOId]

      // 1. 부모폴더가 extraDirs 에 잘 들어왔는지
      if (!_parentDir) throw `부모폴더: extraDirs 에 안 들어왔어요`

      // 2. 부모폴더: 자식폴더 배열 크기 올바른가
      const _parentSubDirArr = _parentDir.subDirOIdsArr
      if (_parentSubDirArr.length !== 5) throw `부모폴더: 자식폴더 갯수가 5개가 아니라 ${_parentSubDirArr.length} 개야`

      // 3. 부모폴더: 자식폴더 배열 순서 올바른가
      const _parentSequence = [] // 리턴받은 자식들의 원래 인덱스를 순서대로 저장한다.
      for (let i = 0; i < 5; i++) {
        _parentSequence.push(parentDir.subDirOIdsArr.indexOf(_parentSubDirArr[i]))
      }
      if (_parentSequence.join(',') !== '0,1,2,3,4') throw `부모폴더: 자식폴더 순서가 0,1,2,3,4 가 아니라 ${_parentSequence.join(',')} 가 됬음`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _5_first_to_last(db: Db, logLevel: number) {
    /**
     * 첫번째 자식폴더를 마지막으로 이동한다.
     * - 자식 폴더 순서가 01234 에서 12340 로 바뀐다.
     */
    try {
      const {jwtPayload, parentDirOId, parentDir} = this
      const moveDirOId = parentDir.subDirOIdsArr[0]

      const data: MoveDirectoryDataType = {
        moveDirOId,
        parentDirOId,
        targetIdx: null
      }
      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      const {directories} = extraDirs
      const _parentDir = directories[parentDirOId]

      // 1. 부모폴더가 extraDirs 에 잘 들어왔는지
      if (!_parentDir) throw `부모폴더: extraDirs 에 안 들어왔어요`

      // 2. 부모폴더: 자식폴더 배열 크기 올바른가
      const _parentSubDirArr = _parentDir.subDirOIdsArr
      if (_parentSubDirArr.length !== 5) throw `부모폴더: 자식폴더 갯수가 5개가 아니라 ${_parentSubDirArr.length} 개야`

      // 3. 부모폴더: 자식폴더 배열 순서 올바른가
      const _parentSequence = [] // 리턴받은 자식들의 원래 인덱스를 순서대로 저장한다.
      for (let i = 0; i < 5; i++) {
        _parentSequence.push(parentDir.subDirOIdsArr.indexOf(_parentSubDirArr[i]))
      }
      if (_parentSequence.join(',') !== '1,2,3,4,0') throw `부모폴더: 자식폴더 순서가 1,2,3,4,0 가 아니라 ${_parentSequence.join(',')} 가 됬음`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _6_last_to_first(db: Db, logLevel: number) {
    /**
     * 마지막 자식폴더를 첫번째로 이동한다.
     * - 자식 폴더 순서가 12340 에서 01234 로 바뀐다.
     */
    try {
      const {jwtPayload, parentDirOId, parentDir} = this
      const moveDirOId = parentDir.subDirOIdsArr[0]

      const data: MoveDirectoryDataType = {
        moveDirOId,
        parentDirOId,
        targetIdx: 0
      }
      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      const {directories} = extraDirs
      const _parentDir = directories[parentDirOId]

      // 1. 부모폴더가 extraDirs 에 잘 들어왔는지
      if (!_parentDir) throw `부모폴더: extraDirs 에 안 들어왔어요`

      // 2. 부모폴더: 자식폴더 배열 크기 올바른가
      const _parentSubDirArr = _parentDir.subDirOIdsArr
      if (_parentSubDirArr.length !== 5) throw `부모폴더: 자식폴더 갯수가 5개가 아니라 ${_parentSubDirArr.length} 개야`

      // 3. 부모폴더: 자식폴더 배열 순서 올바른가
      const _parentSequence = [] // 리턴받은 자식들의 원래 인덱스를 순서대로 저장한다.
      for (let i = 0; i < 5; i++) {
        _parentSequence.push(parentDir.subDirOIdsArr.indexOf(_parentSubDirArr[i]))
      }
      if (_parentSequence.join(',') !== '0,1,2,3,4') throw `부모폴더: 자식폴더 순서가 0,1,2,3,4 가 아니라 ${_parentSequence.join(',')} 가 됬음`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _7_first_to_middle(db: Db, logLevel: number) {
    /**
     * 인덱스 1 폴더를 인덱스 3으로 이동한다.
     * - 자식 폴더 순서가 01234 에서 02314 로 바뀐다.
     */
    try {
      const {jwtPayload, parentDirOId, parentDir} = this
      const moveDirOId = parentDir.subDirOIdsArr[1]

      const data: MoveDirectoryDataType = {
        moveDirOId,
        parentDirOId,
        targetIdx: 3
      }
      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      const {directories} = extraDirs
      const _parentDir = directories[parentDirOId]

      // 1. 부모폴더가 extraDirs 에 잘 들어왔는지
      if (!_parentDir) throw `부모폴더: extraDirs 에 안 들어왔어요`

      // 2. 부모폴더: 자식폴더 배열 크기 올바른가
      const _parentSubDirArr = _parentDir.subDirOIdsArr
      if (_parentSubDirArr.length !== 5) throw `부모폴더: 자식폴더 갯수가 5개가 아니라 ${_parentSubDirArr.length} 개야`

      // 3. 부모폴더: 자식폴더 배열 순서 올바른가
      const _parentSequence = [] // 리턴받은 자식들의 원래 인덱스를 순서대로 저장한다.
      for (let i = 0; i < 5; i++) {
        _parentSequence.push(parentDir.subDirOIdsArr.indexOf(_parentSubDirArr[i]))
      }
      if (_parentSequence.join(',') !== '0,2,3,1,4') throw `부모폴더: 자식폴더 순서가 0,2,3,1,4 가 아니라 ${_parentSequence.join(',')} 가 됬음`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _8_middle_to_first(db: Db, logLevel: number) {
    /**
     * 인덱스 3 폴더를 인덱스 1로 이동한다.
     * - 자식 폴더 순서가 02314 에서 01234 로 바뀐다.
     */
    try {
      const {jwtPayload, parentDirOId, parentDir} = this
      const moveDirOId = parentDir.subDirOIdsArr[1]

      const data: MoveDirectoryDataType = {
        moveDirOId,
        parentDirOId,
        targetIdx: 1
      }
      const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

      const {directories} = extraDirs
      const _parentDir = directories[parentDirOId]

      // 1. 부모폴더가 extraDirs 에 잘 들어왔는지
      if (!_parentDir) throw `부모폴더: extraDirs 에 안 들어왔어요`

      // 2. 부모폴더: 자식폴더 배열 크기 올바른가
      const _parentSubDirArr = _parentDir.subDirOIdsArr
      if (_parentSubDirArr.length !== 5) throw `부모폴더: 자식폴더 갯수가 5개가 아니라 ${_parentSubDirArr.length} 개야`

      // 3. 부모폴더: 자식폴더 배열 순서 올바른가
      const _parentSequence = [] // 리턴받은 자식들의 원래 인덱스를 순서대로 저장한다.
      for (let i = 0; i < 5; i++) {
        _parentSequence.push(parentDir.subDirOIdsArr.indexOf(_parentSubDirArr[i]))
      }
      if (_parentSequence.join(',') !== '0,1,2,3,4') throw `부모폴더: 자식폴더 순서가 0,1,2,3,4 가 아니라 ${_parentSequence.join(',')} 가 됬음`
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
  const testModule = new IndexChange(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
