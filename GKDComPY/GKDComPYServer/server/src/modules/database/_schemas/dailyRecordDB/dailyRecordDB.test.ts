import {Injectable} from '@nestjs/common'
import {model, Model} from 'mongoose'
import {
  DailyRecord,
  DailyRecordSchema,
  RecordBlock,
  RecordBlockSchema
} from './dailyRecordDB.entity'
import {DailyRecordDBService} from './dailyRecordDB.service'

export class DailyRecordDBServiceTest {
  private readonly dailyRecordModel = model(DailyRecord.name, DailyRecordSchema)
  private readonly recordBlockModel = model(RecordBlock.name, RecordBlockSchema)
  public dailyRecordDBService = new DailyRecordDBService(
    this.dailyRecordModel,
    this.recordBlockModel
  )
}
