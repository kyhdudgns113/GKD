/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {AUTH_ADMIN} from '@common/secret'
import {AddDirectoryDataType, JwtPayloadType, MoveDirectoryDataType} from '@common/types'
import {ClientPortServiceTest} from '@modules/database'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 잘못된 입력값들에 대한 서브테스트를 수행한다.
 * - testOK 로 실행한다.
 * - "입력값" 자체가 이상한 경우만을 테스트 한다.
 *
 * 잘못된 입력값 경우
 * 1. moveDirOId 가 없는 경우
 * 2. 존재하지 않는 폴더의 moveDirOId 를 사용하는 경우
 * 3. parentDirOId 가 없는 경우
 * 4. 이미 삭제된 폴더로 이동하려는 경우
 * 5. targetIdx 가 undefined 인 경우
 */
export class WrongInputs extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private dirOId: string
  private deletedDirOId: string
  private jwtPayload: JwtPayloadType
  private rootDirOId: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    /**
     * 테스트용 멀쩡한 디렉토리를 루트에 1개 만든다.
     */
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

      this.rootDirOId = rootDirOId

      const data: AddDirectoryDataType = {
        dirName: this.constructor.name,
        parentDirOId: rootDirOId
      }

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

      const dirOId = extraDirs.dirOIdsArr[2]

      const dir = extraDirs.directories[dirOId]
      if (dir.dirName !== this.constructor.name)
        throw `before: 왜 2번째 인덱스에 새로 만든 디렉토리가 안들어갔지? ${dir.dirName} !== ${this.constructor.name}`

      this.dirOId = dirOId

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_empty_moveDirOId.bind(this), db, logLevel)
      await this.memberFail(this._2_non_exist_moveDirOId.bind(this), db, logLevel)
      await this.memberFail(this._3_empty_parentDirOId.bind(this), db, logLevel)
      await this.memberFail(this._4_deleted_dirOId.bind(this), db, logLevel)
      await this.memberFail(this._5_undefined_targetIdx.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name})
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name + '__2'})
      await this.testDB.resetBaseDB()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_empty_moveDirOId(db: Db, logLevel: number) {
    try {
      const data: MoveDirectoryDataType = {
        moveDirOId: '',
        parentDirOId: this.rootDirOId,
        targetIdx: null
      }

      await this.portService.moveDirectory(this.jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_non_exist_moveDirOId(db: Db, logLevel: number) {
    try {
      const {jwtPayload, rootDirOId} = this

      const data: AddDirectoryDataType = {
        dirName: this.constructor.name + '__2',
        parentDirOId: rootDirOId
      }

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs

      const dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === data.dirName)[0]
      this.deletedDirOId = dirOId

      await this.portService.deleteDirectory(jwtPayload, dirOId)

      const dataMove: MoveDirectoryDataType = {
        moveDirOId: dirOId,
        parentDirOId: rootDirOId,
        targetIdx: null
      }

      await this.portService.moveDirectory(jwtPayload, dataMove)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_empty_parentDirOId(db: Db, logLevel: number) {
    try {
      const {jwtPayload, dirOId} = this

      const data: MoveDirectoryDataType = {
        moveDirOId: dirOId,
        parentDirOId: '',
        targetIdx: null
      }

      await this.portService.moveDirectory(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _4_deleted_dirOId(db: Db, logLevel: number) {
    try {
      const {jwtPayload, deletedDirOId, dirOId} = this

      const data: MoveDirectoryDataType = {
        moveDirOId: deletedDirOId,
        parentDirOId: dirOId,
        targetIdx: null
      }

      await this.portService.moveDirectory(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _5_undefined_targetIdx(db: Db, logLevel: number) {
    try {
      const {dirOId, jwtPayload, rootDirOId} = this

      const data: MoveDirectoryDataType = {
        moveDirOId: dirOId,
        parentDirOId: rootDirOId,
        targetIdx: undefined
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
  const testModule = new WrongInputs(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
