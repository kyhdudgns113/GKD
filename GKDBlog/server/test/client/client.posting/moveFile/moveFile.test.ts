/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import {NoAuth} from './noAuth'
import {WrongInputs} from './wrongInputs'
import {ParentSame} from './parentSame'
import {ParentChange} from './ParentChange'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class MoveFile extends GKDTestBase {
  private NoAuth: NoAuth
  private WrongInputs: WrongInputs
  private ParentSame: ParentSame
  private ParentChange: ParentChange

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.NoAuth = new NoAuth(REQUIRED_LOG_LEVEL + 1)
    this.WrongInputs = new WrongInputs(REQUIRED_LOG_LEVEL + 1)
    this.ParentSame = new ParentSame(REQUIRED_LOG_LEVEL + 1)
    this.ParentChange = new ParentChange(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      /**
       * 1. 권한이 없는 경우
       * 2. 입력값 자체가 이상한 경우
       * 3. 부모가 바뀌지 않는 경우
       * 4. 부모가 바뀌는 경우
       *   - 파일 이름이 중복된 경우
       *   - 지워진 디렉토리로 옮기려는 경우
       *     + 3번에서는 이걸 하지 않는다
       *     + 어차피 이 파일도 지워진다.
       */

      await this.NoAuth.testOK(db, logLevel)
      await this.WrongInputs.testOK(db, logLevel)
      await this.ParentSame.testOK(db, logLevel)
      await this.ParentChange.testOK(db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
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
  const testModule = new MoveFile(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
