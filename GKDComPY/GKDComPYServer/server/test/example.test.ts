/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from './_common'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다.
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 0

export class ___Test extends GKDTestBase {
  // 아래 두 줄은 다른 테스트모듈 사용 예시이다.
  // 실제로 저 파일들 매우 귀찮았어서 주석으로 처리했다.
  // private testOtherModule: TestOtherModule extends GKDTestBase
  // private testOtherCatchModule: TestOtherCatchModule extends GKDTestBase

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    // this.testOtherModule = new TestOtherModule(REQUIRED_LOG_LEVEL + 1)
    // this.testOtherCatchModule = new TestOtherCatchModule(REQUIRED_LOG_LEVEL + 1)
  }

  //////////////////////////////////////////////////
  //                                              //
  //  GKDTestBase 의 abstract 함수를 작성하는 공간  //
  //                                              //
  //////////////////////////////////////////////////

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      // 테스트용 DB 를 만든다던가...
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      /**
       * 아래 주석으로 된건 다른 Test 모듈 사용예시이다.
       */
      // await this.testOtherModule.test(db, logLevel) // 성공해야 하는 테스트 모듈 사용 예시
      // await this.testOtherCatchModule.testCatch(db, logLevel) // 실패해야 하는 테스트 모듈 사용 예시

      // 성공해야 하는 멤버함수 테스트는 다음 둘 중 하나로 해도 된다.
      await this._exampleTest(db, logLevel)
      await this.memberOK(this._exampleTest.bind(test), db, logLevel)

      // 실패햐아 하는 멤버함수 테스트는 다음 방법으로만 한다.
      // 이렇게 안하면 malloc 만 하고 free 되지 않는 일이 발생할 수 있다.
      await this.memberFail(this._exampleErrorTest.bind(this), db, logLevel)
      // await this._exampleErrorTest(db, logLevel) // 절대 하면 안된다.
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      // 테스트용 DB 를 제거한다던가...
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /////////////////////////////////////////
  //                                     //
  //  테스트를 할 함수를 작성하는 공간이다. //
  //                                     //
  /////////////////////////////////////////

  // 작동을 성공적으로 마쳐야 하는 함수 작성의 예시
  private async _exampleTest(db: Db, logLevel: number) {
    try {
      this.logMessage('작동이 완료되어야 하는 함수', 0)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // 에러를 throw 해야 성공인 함수를 작성하는 예시
  private async _exampleErrorTest(db: Db, logLevel: number) {
    try {
      this.logMessage('에러를 throw 해야하는 함수', 0)
      throw `성공적으로 에러를 던집니다.`
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
  const testModule = new ___Test(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
