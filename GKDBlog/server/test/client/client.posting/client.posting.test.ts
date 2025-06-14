/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import {AddDirectory} from './addDirectory'
import {AddFile} from './addFile'
import {DeleteDirectory} from './deleteDirectory'
import {DeleteFile} from './deleteFile'
import {MoveDirectory} from './moveDirectory'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 2

export class ClientPosting extends GKDTestBase {
  private AddDirectory: AddDirectory
  private AddFile: AddFile
  private DeleteDirectory: DeleteDirectory
  private DeleteFile: DeleteFile
  private MoveDirectory: MoveDirectory

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.AddDirectory = new AddDirectory(REQUIRED_LOG_LEVEL + 1)
    this.AddFile = new AddFile(REQUIRED_LOG_LEVEL + 1)
    this.DeleteDirectory = new DeleteDirectory(REQUIRED_LOG_LEVEL + 1)
    this.DeleteFile = new DeleteFile(REQUIRED_LOG_LEVEL + 1)
    this.MoveDirectory = new MoveDirectory(REQUIRED_LOG_LEVEL + 1)
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
      await this.AddDirectory.testOK(db, logLevel)
      await this.AddFile.testOK(db, logLevel)
      await this.DeleteDirectory.testOK(db, logLevel)
      await this.DeleteFile.testOK(db, logLevel)
      await this.MoveDirectory.testOK(db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
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
  const testModule = new ClientPosting(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
