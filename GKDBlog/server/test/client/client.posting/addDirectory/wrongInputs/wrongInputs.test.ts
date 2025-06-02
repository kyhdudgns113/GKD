/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {ClientPortServiceTest} from '../../../../../src/modules'
import {AddDirectoryDataType, JwtPayloadType} from '../../../../../src/common/types'
import {AUTH_ADMIN} from '../../../../../src/common/secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 잘못된 입력을 넣는 경우릁 테스트한다.
 * - 루트 디렉토리에 생성한다.
 * 잘못 들어오는 경우들을 전부 테스트하기 때문에 이 테스트는 성공해야 한다.
 *
 * 1. 이름이 너무 긴 경우
 * 2. 이름이 너무 짧은 경우
 * 3. 이름이 안 들어온 경우
 * 4. 부모 디렉토리 이상한거 들어온 경우
 * 5. 부모 디렉토리 안 넣어준 경우
 * 6. 루트도 아닌데 부모 디렉토리 NULL 로 넣은 경우
 */
export class WrongInputs extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private dirNameTooLong: string
  private dirNameTooShort: string
  private dirNameEmpty: string
  private wrongParentDirOId: string
  private jwtPayload: JwtPayloadType

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {signUpType, userOId, userId, userName} = user

      const jwtPayload: JwtPayloadType = {
        signUpType,
        userOId,
        userId,
        userName
      }

      this.dirNameTooLong = 'd'.repeat(31)
      this.dirNameTooShort = 'd'
      this.dirNameEmpty = ''
      this.wrongParentDirOId = '123456781234567812345678'
      this.jwtPayload = jwtPayload
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      await this.memberFail(this._1_nameTooLong.bind(this), db, logLevel)
      await this.memberFail(this._2_nameTooShort.bind(this), db, logLevel)
      await this.memberFail(this._3_nameEmpty.bind(this), db, logLevel)
      await this.memberFail(this._4_wrongParentDirOId.bind(this), db, logLevel)
      await this.memberFail(this._5_noParentDirOId.bind(this), db, logLevel)
      await this.memberFail(this._6_forceNULLParentDirOId.bind(this), db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {dirNameEmpty, dirNameTooLong, dirNameTooShort} = this
      await this.db.collection('directorydbs').deleteOne({dirName: this.constructor.name})
      await this.db.collection('directorydbs').deleteOne({dirName: dirNameEmpty})
      await this.db.collection('directorydbs').deleteOne({dirName: dirNameTooShort})
      await this.db.collection('directorydbs').deleteOne({dirName: dirNameTooLong})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _1_nameTooLong(db: Db, logLevel: number) {
    try {
      const {dirNameTooLong, jwtPayload} = this
      const {directory} = this.testDB.getRootDir()

      const dirName = dirNameTooLong
      const parentDirOId = directory.dirOId

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      await this.portService.addDirectory(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  private async _2_nameTooShort(db: Db, logLevel: number) {
    try {
      const {dirNameTooShort, jwtPayload} = this
      const {directory} = this.testDB.getRootDir()

      const dirName = dirNameTooShort
      const parentDirOId = directory.dirOId

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      await this.portService.addDirectory(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _3_nameEmpty(db: Db, logLevel: number) {
    try {
      const {dirNameEmpty, jwtPayload} = this
      const {directory} = this.testDB.getRootDir()

      const dirName = dirNameEmpty
      const parentDirOId = directory.dirOId

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      await this.portService.addDirectory(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _4_wrongParentDirOId(db: Db, logLevel: number) {
    try {
      const {wrongParentDirOId, jwtPayload} = this

      const dirName = this.constructor.name
      const parentDirOId = wrongParentDirOId

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      await this.portService.addDirectory(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _5_noParentDirOId(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this

      const dirName = this.constructor.name
      const parentDirOId = ''

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      await this.portService.addDirectory(jwtPayload, data)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _6_forceNULLParentDirOId(db: Db, logLevel: number) {
    try {
      const {jwtPayload} = this

      const dirName = this.constructor.name
      const parentDirOId = 'NULL'

      const data: AddDirectoryDataType = {
        dirName,
        parentDirOId
      }

      await this.portService.addDirectory(jwtPayload, data)
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
  const testModule = new WrongInputs(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
