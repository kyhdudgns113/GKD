import mongoose from 'mongoose'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../_common'
import {AddNextWeek, AddPrevWeek, AddRowMember} from './adds'
import {DeleteRowMember, DeleteWeekRow, GetWeeklyRecord, GetWeekRowsArr} from './CtoG'
import {SetComments, SetRowMember} from './sets'

const DEFAULT_REQUIRED_LOG_LEVEL = 2

export class ClientRecord extends GKDTestBase {
  private addNextWeek: AddNextWeek
  private addPrevWeek: AddPrevWeek
  private addRowMember: AddRowMember

  private deleteRowMember: DeleteRowMember
  private deleteWeekRow: DeleteWeekRow

  private getWeeklyRecord: GetWeeklyRecord
  private getWeekRowsArr: GetWeekRowsArr

  private setComments: SetComments
  private setRowMember: SetRowMember

  //
  // 생성자
  //
  constructor(REQUIRED_LOG_LEVEL: number = 2) {
    super(REQUIRED_LOG_LEVEL)

    this.addNextWeek = new AddNextWeek(REQUIRED_LOG_LEVEL + 1)
    this.addPrevWeek = new AddPrevWeek(REQUIRED_LOG_LEVEL + 1)
    this.addRowMember = new AddRowMember(REQUIRED_LOG_LEVEL + 1)

    this.deleteRowMember = new DeleteRowMember(REQUIRED_LOG_LEVEL + 1)
    this.deleteWeekRow = new DeleteWeekRow(REQUIRED_LOG_LEVEL + 1)

    this.getWeeklyRecord = new GetWeeklyRecord(REQUIRED_LOG_LEVEL + 1)
    this.getWeekRowsArr = new GetWeekRowsArr(REQUIRED_LOG_LEVEL + 1)

    this.setComments = new SetComments(REQUIRED_LOG_LEVEL + 1)
    this.setRowMember = new SetRowMember(REQUIRED_LOG_LEVEL + 1)
  }

  protected db: mongoose.mongo.Db | null
  protected logLevel: number

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
      await this.addNextWeek.testOK(db, logLevel)
      await this.addPrevWeek.testOK(db, logLevel)
      await this.addRowMember.testOK(db, logLevel)

      await this.deleteRowMember.testOK(db, logLevel)
      await this.deleteWeekRow.testOK(db, logLevel)

      await this.getWeeklyRecord.testOK(db, logLevel)
      await this.getWeekRowsArr.testOK(db, logLevel)
      // this.logMessage(`record 의 상당부분이 주석처리 되었어요`, 0)
      // BLANK LINE COMMENT:
      await this.setComments.testOK(db, logLevel)
      await this.setRowMember.testOK(db, logLevel)
      // await this.setTHead.testOK(db, logLevel)
      // await this.submitRecord.testOK(db, logLevel)
      this.logMessage(`record 의 몇 개 모듈이 구현 안되었어요`, 0)
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
  const testModule = new ClientRecord(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
