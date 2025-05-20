import {Injectable} from '@nestjs/common'
import {Model} from 'mongoose'
import {InjectModel} from '@nestjs/mongoose'
import {DailyRecord, RecordBlock} from './dailyRecordDB.entity'
import {DailyRecordType, MemberInfoType} from '../../../../common/types'

@Injectable()
export class DailyRecordDBService {
  constructor(
    @InjectModel(DailyRecord.name) private readonly dailyRecordModel: Model<DailyRecord>,
    @InjectModel(RecordBlock.name) private readonly recordBlockModel: Model<RecordBlock>
  ) {}

  async createOrUpdateRecord(
    where: string,
    clubOId: string,
    date: number,
    name: string,
    condError: number,
    results: number[],
    comment: string,
    memOId: string | null
  ) {
    try {
      const newRecordsArr = Array(3)
        .fill(null)
        .map((_, idx) => new this.recordBlockModel({result: results[idx]}))
      const isExist = await this.dailyRecordModel.findOne({clubOId, date, name})
      // BLANK LINE COMMENT:
      if (isExist) {
        await this.dailyRecordModel.updateOne(
          {clubOId, date, name},
          {$set: {condError, recordsArr: newRecordsArr, comment, memOId}}
        )
      } // BLANK LINE COMMENT:
      else {
        const newRecord = new this.dailyRecordModel({
          clubOId,
          date,
          name,
          condError,
          recordsArr: newRecordsArr,
          comment,
          memOId
        })
        await newRecord.save()
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readDailyArrByMemberWithRange(where: string, memOId: string, start: number, end: number) {
    try {
      const dailyArrFromDB = await this.dailyRecordModel.find({
        memOId,
        date: {$gte: start, $lte: end}
      })
      const dailyRecordsArr: DailyRecordType[] = dailyArrFromDB.map((daily, _idx) => {
        const {clubOId, memOId, name, date} = daily
        const {condError, comment, recordsArr} = daily
        const elem: DailyRecordType = {
          clubOId,
          memOId,
          name,
          date,
          condError,
          comment,
          recordsArr
        }
        return elem
      })

      return {dailyRecordsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readDailyArrByWeeklyInfo(where: string, clubOId: string, start: number, end: number) {
    try {
      const recordsArrDB = await this.dailyRecordModel.find({
        clubOId,
        date: {$gte: start, $lte: end}
      })
      const recordsArr: DailyRecordType[] = recordsArrDB.map(record => {
        const {clubOId, memOId, name, date} = record
        const {condError, comment, recordsArr} = record
        const elem: DailyRecordType = {clubOId, memOId, name, date, condError, comment, recordsArr}
        return elem
      })
      return {recordsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateDailyMemOId(where: string, clubOId: string, member: MemberInfoType) {
    try {
      await this.dailyRecordModel.updateMany(
        {clubOId, name: member.name},
        {$set: {memOId: member.memOId}}
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateRecordName(
    where: string,
    clubOId: string,
    start: number,
    end: number,
    prevName: string,
    name: string
  ) {
    try {
      await this.dailyRecordModel.updateMany(
        {clubOId, date: {$gte: start, $lte: end}, name: prevName},
        {name}
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteDailyRecords(
    where: string,
    clubOId: string,
    name: string,
    start: number,
    end: number
  ) {
    try {
      await this.dailyRecordModel.deleteMany({clubOId, name, date: {$gte: start, $lte: end}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteDailyRecordsClub(where: string, clubOId: string, start: number, end: number) {
    try {
      await this.dailyRecordModel.deleteMany({clubOId, date: {$gte: start, $lte: end}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
