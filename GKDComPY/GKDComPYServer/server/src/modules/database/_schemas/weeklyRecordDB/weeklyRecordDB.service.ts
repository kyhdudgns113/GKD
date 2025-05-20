import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {
  RecordColInfo,
  RecordDateInfo,
  RecordMemberInfo,
  RecordRowInfo,
  WeeklyRecord
} from './weeklyRecordDB.entity'
import {Model, Types} from 'mongoose'
import {MemberInfoType, RecordMemberInfoType, WeeklyRecordType} from '../../../../common/types'
import {shiftDateValue} from '../../../../common/utils'

@Injectable()
export class WeeklyRecordDBService {
  constructor(
    @InjectModel(WeeklyRecord.name) private weeklyModel: Model<WeeklyRecord>,
    @InjectModel(RecordRowInfo.name) private rowModel: Model<RecordRowInfo>,
    @InjectModel(RecordMemberInfo.name) private memberModel: Model<RecordMemberInfo>,
    @InjectModel(RecordColInfo.name) private colModel: Model<RecordColInfo>,
    @InjectModel(RecordDateInfo.name) private dateModel: Model<RecordDateInfo>
  ) {}

  async createWeeklyRecord(
    where: string,
    clubOId: string,
    start: number,
    end: number,
    rowInfosArr: RecordMemberInfoType[]
  ) {
    try {
      const membersInfo = rowInfosArr.map(memberInfo => new this.memberModel(memberInfo))
      const rowInfo = new this.rowModel({clubOId, membersInfo})
      const dateInfo = Array(6)
        .fill(null)
        .map((unUsed, idx) => new this.dateModel({clubOId, date: shiftDateValue(start, idx)}))
      const colInfo = new this.colModel({clubOId, dateInfo})
      const weeklyRecordToDB = new this.weeklyModel({clubOId, start, end, rowInfo, colInfo})
      const weeklyRecordDB = await weeklyRecordToDB.save()

      const weeklyRecord: WeeklyRecordType = {
        weekOId: weeklyRecordDB._id.toString(),
        clubOId: weeklyRecordDB.clubOId,
        start: weeklyRecordDB.start,
        end: weeklyRecordDB.end,
        title: weeklyRecordDB.title,
        comment: weeklyRecordDB.comment,
        rowInfo: weeklyRecordDB.rowInfo,
        colInfo: weeklyRecordDB.colInfo
      }

      return {weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async createWeeklyMember(
    where: string,
    weekOId: string,
    position: number,
    name: string,
    batterPower: number,
    pitcherPower: number,
    memOId: string | null
  ) {
    where = where + '/createWeeklyMember'
    try {
      const _id = new Types.ObjectId(weekOId)
      const weeklyDB = await this.weeklyModel.findOne({_id})
      if (!weeklyDB)
        throw {gkd: {weekOId: '이런 기록은 존재하지 않아요'}, gkdStatus: {name, weekOId}, where}

      // 배열에 넣기
      weeklyDB.rowInfo.membersInfo.push({name, position, batterPower, pitcherPower, memOId})

      // 배열 정렬
      weeklyDB.rowInfo.membersInfo.sort((mem1, mem2) => {
        if (mem1.position === mem2.position) {
          return mem2.batterPower + mem2.pitcherPower - (mem1.batterPower + mem1.pitcherPower)
        } // BLANK LINE COMMENT:
        else {
          return mem2.position - mem1.position
        }
      })

      // DB 업데이트
      await this.weeklyModel.updateOne(
        {_id},
        {$set: {[`rowInfo.membersInfo`]: weeklyDB.rowInfo.membersInfo}}
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readWeeklyRecord(where: string, weekOId: string) {
    where = where + '/readWeeklyRecord'
    try {
      const _id = new Types.ObjectId(weekOId)
      const weeklyRecordDB = await this.weeklyModel.findOne({_id})
      if (!weeklyRecordDB)
        throw {gkd: {weekOId: '이런 주간 기록은 존재하지 않아요'}, gkdStatus: {weekOId}, where}

      const weeklyRecord: WeeklyRecordType = {
        weekOId: weekOId,
        clubOId: weeklyRecordDB.clubOId,
        start: weeklyRecordDB.start,
        end: weeklyRecordDB.end,
        title: weeklyRecordDB.title,
        comment: weeklyRecordDB.comment,
        rowInfo: weeklyRecordDB.rowInfo,
        colInfo: weeklyRecordDB.colInfo
      }
      return {weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateWeeklyColComments(where: string, weekOId: string, dayIdx: number, comments: string) {
    where = where + '/updateWeeklyColComments'
    try {
      if (dayIdx < 0 || dayIdx > 5)
        throw {gkd: {dayIdx: `일간 인덱스 범위초과`}, gkdStatus: {dayIdx, weekOId}, where}
      const _id = new Types.ObjectId(weekOId)
      const result = await this.weeklyModel.updateOne(
        {_id},
        {$set: {[`colInfo.dateInfo.${dayIdx}.comments`]: comments}}
      )
      if (result.modifiedCount === 0)
        throw {
          gkd: {weekOId: '이런 주간 기록이 존재할까요?'},
          gkdStatus: {weekOId, comments},
          where
        }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateWeeklyComments(where: string, weekOId: string, comment: string) {
    try {
      const _id = new Types.ObjectId(weekOId)
      const res = await this.weeklyModel.updateOne({_id}, {$set: {comment}})
      // 변경 안되도 에러 리턴하지 말자.
      // 코멘트 안 바꿀수도 있지
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateWeeklyMemOId(where: string, clubOId: string, member: MemberInfoType) {
    try {
      const weeklyArrFromDB = await this.weeklyModel.find({clubOId})

      for (let weeklyRecord of weeklyArrFromDB) {
        const _id = weeklyRecord._id
        const {membersInfo: prevInfo} = weeklyRecord.rowInfo
        const membersInfo: RecordMemberInfoType[] = prevInfo.map((_member, __) => {
          if (member.name === _member.name) {
            _member.memOId = member.memOId
          }
          return _member
        })

        await this.weeklyModel.updateOne({_id}, {$set: {[`rowInfo.membersInfo`]: membersInfo}})
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateWeeklyRowMember(
    where: string,
    weekOId: string,
    prevName: string,
    position: number,
    name: string,
    batterPower: number,
    pitcherPower: number,
    memOId: string | null
  ) {
    where = where + '/updateWeeklyRowMember'
    try {
      const _id = new Types.ObjectId(weekOId)
      const weeklyDB = await this.weeklyModel.findOne({_id})
      if (!weeklyDB)
        throw {gkd: {weekOId: '잘못된 기록에 대한 접근입니다'}, gkdStatus: {weekOId}, where}

      // 배열에 넣는 부분
      let i = 0
      for (i = 0; i < weeklyDB.rowInfo.membersInfo.length; i++) {
        if (weeklyDB.rowInfo.membersInfo[i].name === prevName) {
          weeklyDB.rowInfo.membersInfo[i] = {position, name, batterPower, pitcherPower, memOId}
          break
        }
      }

      // 배열을 정렬
      weeklyDB.rowInfo.membersInfo.sort((mem1, mem2) => {
        if (mem1.position === mem2.position) {
          return mem2.batterPower + mem2.pitcherPower - (mem1.batterPower + mem1.pitcherPower)
        } // BLANK LINE COMMENT:
        else {
          return mem2.position - mem1.position
        }
      })

      // DB 업데이트
      const result = await this.weeklyModel.updateOne(
        {_id},
        {$set: {[`rowInfo.membersInfo`]: weeklyDB.rowInfo.membersInfo}}
      )

      // 바뀌었는지 체크
      if (result.modifiedCount === 0)
        throw {gkd: {error: '왜 안바뀌었을까요'}, gkdStatus: {weekOId, prevName, name}, where}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateWeeklyTHead(
    where: string,
    weekOId: string,
    dateIdx: number,
    enemyName: string,
    pitchOrder: number | null,
    order: string
  ) {
    where = where + '/updateWeeklyTHead'
    try {
      const _id = new Types.ObjectId(weekOId)
      const weeklyDB = await this.weeklyModel.findOne({_id})
      if (!weeklyDB)
        throw {
          gkd: {weekOId: '이런 기록은 존재하지 않습니다.'},
          gkdStatus: {weekOId, dateIdx},
          where
        }

      await this.weeklyModel.updateOne(
        {_id},
        {
          $set: {
            [`colInfo.dateInfo.${dateIdx}.enemyName`]: enemyName,
            [`colInfo.dateInfo.${dateIdx}.pitchOrder`]: pitchOrder,
            [`colInfo.dateInfo.${dateIdx}.order`]: order
          }
        }
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteWeeklyRecord(where: string, weekOId: string) {
    try {
      const _id = new Types.ObjectId(weekOId)
      await this.weeklyModel.deleteOne({_id})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteWeeklyRowMember(where: string, weekOId: string, name: string) {
    where = where + '/deleteWeeklyRowMember'
    try {
      const _id = new Types.ObjectId(weekOId)
      const weeklyDB = await this.weeklyModel.findOne({_id})
      if (!weeklyDB)
        throw {gkd: {weekOId: '해당 기록은 존재하지 않아요'}, gkdStatus: {weekOId}, where}
      const membersInfo = weeklyDB.rowInfo.membersInfo.filter(memInfo => memInfo.name !== name)

      await this.weeklyModel.updateOne({_id}, {$set: {[`rowInfo.membersInfo`]: membersInfo}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
