/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'

import {ClientPortServiceTest} from '../../../../../src/modules'
import {AUTH_ADMIN} from '../../../../../src/common/secret'
import {AddFileDataType, JwtPayloadType} from '../../../../../src/common/types'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 같은 부모폴더 내에서 중복된 이름인 파일을 생성시도
 * - 실패해야된다.
 */
export class TryDuplicate extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private isSecondCreated = false

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {user} = this.testDB.getLocalUser(AUTH_ADMIN)
      const {userId, userName, userOId, signUpType} = user
      const jwtPayload: JwtPayloadType = {userId, userName, userOId, signUpType}

      const fileName = this.constructor.name
      const parentDirOId = this.testDB.getRootDir().directory.dirOId

      const data: AddFileDataType = {fileName, parentDirOId}

      await this.portService.addFile(jwtPayload, data)
      await this.portService.addFile(jwtPayload, data)

      this.isSecondCreated = true

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      await this.db.collection('filedbs').deleteOne({name: this.constructor.name})
      if (this.isSecondCreated) {
        await this.db.collection('filedbs').deleteOne({name: this.constructor.name})
      }
      await this.testDB.resetBaseDB()
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
  const testModule = new TryDuplicate(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testFail(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
