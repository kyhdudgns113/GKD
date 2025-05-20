import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {
  BlockedTrying,
  TryErrorLevels,
  TryErrorMemOId,
  TryErrorSkillIdxs,
  TryNameOver,
  TryPosIdxOver,
  TryPosIdxUnder,
  TryToOtherClub,
  WorkCorrect
} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class SetCardInfo extends GKDTestBase {
  private blockedTrying: BlockedTrying
  private tryErrorLevels: TryErrorLevels
  private tryErrorMemOIds: TryErrorMemOId
  private tryErrorSkillIdxs: TryErrorSkillIdxs
  private tryNameOver: TryNameOver
  private tryPosIdxOver: TryPosIdxOver
  private tryPosIdxUnder: TryPosIdxUnder
  private tryToOtherClub: TryToOtherClub
  private workCorrect: WorkCorrect

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.blockedTrying = new BlockedTrying(REQUIRED_LOG_LEVEL + 1)
    this.tryErrorLevels = new TryErrorLevels(REQUIRED_LOG_LEVEL + 1)
    this.tryErrorMemOIds = new TryErrorMemOId(REQUIRED_LOG_LEVEL + 1)
    this.tryErrorSkillIdxs = new TryErrorSkillIdxs(REQUIRED_LOG_LEVEL + 1)
    this.tryNameOver = new TryNameOver(REQUIRED_LOG_LEVEL + 1)
    this.tryPosIdxOver = new TryPosIdxOver(REQUIRED_LOG_LEVEL + 1)
    this.tryPosIdxUnder = new TryPosIdxUnder(REQUIRED_LOG_LEVEL + 1)
    this.tryToOtherClub = new TryToOtherClub(REQUIRED_LOG_LEVEL + 1)
    this.workCorrect = new WorkCorrect(REQUIRED_LOG_LEVEL + 1)
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
    /**
     * 에러입력 테스트 안하는 것들과 이유
     *    memOId: 이거 없으면 어차피 변화 안함.
     *    name_공란 : 이름 없앤채로 저장해도 무방하다
     */
    try {
      await this.blockedTrying.testFail(db, logLevel)

      await this.tryErrorLevels.testOK(db, logLevel) // test 로 돌리는게 맞다. 해당 파일에서 설명
      await this.tryErrorMemOIds.testFail(db, logLevel)
      await this.tryErrorSkillIdxs.testOK(db, logLevel) // test 로 돌리는게 맞다. 해당 파일에서 설명
      await this.tryNameOver.testFail(db, logLevel)
      await this.tryPosIdxOver.testFail(db, logLevel)
      await this.tryPosIdxUnder.testFail(db, logLevel)
      await this.tryToOtherClub.testFail(db, logLevel)
      await this.workCorrect.testOK(db, logLevel)
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
  const testModule = new SetCardInfo(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
