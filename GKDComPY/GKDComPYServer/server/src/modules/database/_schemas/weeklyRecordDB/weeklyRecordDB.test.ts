import {Injectable} from '@nestjs/common'
import {model, Model} from 'mongoose'
import {
  RecordColInfo,
  RecordColInfoSchema,
  RecordDateInfo,
  RecordDateInfoSchema,
  RecordMemberInfo,
  RecordMemberInfoSchema,
  RecordRowInfo,
  RecordRowInfoSchema,
  WeeklyRecord,
  WeeklyRecordSchema
} from './weeklyRecordDB.entity'
import {WeeklyRecordDBService} from './weeklyRecordDB.service'

export class WeeklyRecordDBServiceTest {
  private weeklyModel = model(WeeklyRecord.name, WeeklyRecordSchema)
  private rowModel = model(RecordRowInfo.name, RecordRowInfoSchema)
  private memberModel = model(RecordMemberInfo.name, RecordMemberInfoSchema)
  private colModel = model(RecordColInfo.name, RecordColInfoSchema)
  private dateModel = model(RecordDateInfo.name, RecordDateInfoSchema)

  public weeklyRecordDBService = new WeeklyRecordDBService(
    this.weeklyModel,
    this.rowModel,
    this.memberModel,
    this.colModel,
    this.dateModel
  )
}
