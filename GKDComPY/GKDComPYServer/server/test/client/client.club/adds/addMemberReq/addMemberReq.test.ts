import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../_common'
import {
  AddExistMember,
  AddExistOtherClubMember,
  AddMultipleMember,
  AddNewMember,
  AddOtherCommMember,
  AddToNoneClub,
  BlockedTrying
} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

/**
 * 멤버 리스트에 멤버 추가하는것을 테스트한다
 */
export class AddMemberReq extends GKDTestBase {
  private readonly addExistMember: AddExistMember
  private readonly addExistOtherClubMember: AddExistOtherClubMember
  private readonly addMultipleMember: AddMultipleMember
  private readonly addNewMember: AddNewMember
  private readonly addOtherCommMember: AddOtherCommMember
  private readonly addToNoneClub: AddToNoneClub
  private readonly memberTryToAdd: BlockedTrying

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.addExistMember = new AddExistMember(REQUIRED_LOG_LEVEL + 1)
    this.addExistOtherClubMember = new AddExistOtherClubMember(REQUIRED_LOG_LEVEL + 1)
    this.addMultipleMember = new AddMultipleMember(REQUIRED_LOG_LEVEL + 1)
    this.addNewMember = new AddNewMember(REQUIRED_LOG_LEVEL + 1)
    this.addOtherCommMember = new AddOtherCommMember(REQUIRED_LOG_LEVEL + 1)
    this.addToNoneClub = new AddToNoneClub(REQUIRED_LOG_LEVEL + 1)
    this.memberTryToAdd = new BlockedTrying(REQUIRED_LOG_LEVEL + 1)
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
      await this.addExistMember.testFail(db, logLevel)
      await this.addExistOtherClubMember.testFail(db, logLevel)
      await this.addMultipleMember.testOK(db, logLevel)
      await this.addNewMember.testOK(db, logLevel)
      await this.addOtherCommMember.testFail(db, logLevel)
      await this.addToNoneClub.testFail(db, logLevel)
      await this.memberTryToAdd.testFail(db, logLevel)
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
  const testModule = new AddMemberReq(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
