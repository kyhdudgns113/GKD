import mongoose from 'mongoose'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../_common'
import {AddMemberReq} from './adds'
import {ChangeMemClub, DeleteClubMember, GetMemberRecordsArr, GetMembersByClub} from './CtoG'
import {SetCardInfo, SetMemComment, SetMemPos} from './sets'
import {SetMemPower} from './sets/setMemPower'

const DEFAULT_REQUIRED_LOG_LEVEL = 2

export class ClientClub extends GKDTestBase {
  private addMemberReq: AddMemberReq

  private changeMemClub: ChangeMemClub
  private deleteClubMember: DeleteClubMember

  private getMemberRecordsArr: GetMemberRecordsArr
  private getMembersByClub: GetMembersByClub

  private setCardInfo: SetCardInfo
  private setMemComment: SetMemComment
  private setMemPos: SetMemPos
  private setMemPower: SetMemPower

  // 생성자
  constructor(REQUIRED_LOG_LEVEL: number = DEFAULT_REQUIRED_LOG_LEVEL) {
    super(REQUIRED_LOG_LEVEL)
    this.addMemberReq = new AddMemberReq(REQUIRED_LOG_LEVEL + 1)

    this.changeMemClub = new ChangeMemClub(REQUIRED_LOG_LEVEL + 1)
    this.deleteClubMember = new DeleteClubMember(REQUIRED_LOG_LEVEL + 1)

    this.getMemberRecordsArr = new GetMemberRecordsArr(REQUIRED_LOG_LEVEL + 1)
    this.getMembersByClub = new GetMembersByClub(REQUIRED_LOG_LEVEL + 1)

    this.setCardInfo = new SetCardInfo(REQUIRED_LOG_LEVEL + 1)
    this.setMemComment = new SetMemComment(REQUIRED_LOG_LEVEL + 1)
    this.setMemPos = new SetMemPos(REQUIRED_LOG_LEVEL + 1)
    this.setMemPower = new SetMemPower(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mongoose.mongo.Db, logLevel: number) {
    try {
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: mongoose.mongo.Db, logLevel: number): Promise<void> {
    try {
      // BLANK LINE COMMENT:
      await this.addMemberReq.testOK(db, logLevel)

      await this.changeMemClub.testOK(db, logLevel)
      await this.deleteClubMember.testOK(db, logLevel)
      this.logMessage('ClientClub 상당부분 주석처리 되었어요')

      // await this.getMemberRecordsArr.testOK(db, logLevel)
      // await this.getMembersByClub.testOK(db, logLevel)

      // await this.setCardInfo.testOK(db, logLevel)
      // await this.setMemComment.testOK(db, logLevel)
      // await this.setMemPos.testOK(db, logLevel)
      // await this.setMemPower.testOK(db, logLevel)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: mongoose.mongo.Db, logLevel: number) {
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
  const testModule = new ClientClub(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
