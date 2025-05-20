import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {Club, WeekRow} from './clubDB.entity'
import {ClubInfoType} from '../../../../common/types'

@Injectable()
export class ClubDBService {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<Club>,
    @InjectModel(WeekRow.name) private weekRowModel: Model<WeekRow>
  ) {}

  async createClub(where: string, commOId: string, name: string) {
    where = where + '/createClub'
    try {
      const isHuboExist = await this.clubModel.findOne({commOId, name: '후보군'})
      if (name != '후보군' && !isHuboExist) {
        throw {gkd: {name: '후보군 클럽이 먼저 있어야 합니다.'}, gkdStatus: {name, commOId}, where}
      }

      const isExist = await this.clubModel.findOne({commOId, name})
      if (isExist) {
        throw {gkd: {name: '이미 해당 클럽이 있습니다.'}, gkdStatus: {commOId, name}, where}
      }

      const newClub = new this.clubModel({commOId, name})
      await newClub.save()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readClubByClubOId(where: string, clubOId: string) {
    where = where + '/readClubByClubOId'
    try {
      const _id = new Types.ObjectId(clubOId)
      const clubDB = await this.clubModel.findOne({_id})
      if (!clubDB)
        throw {gkd: {clubOId: '이런 클럽은 존재하지 않아요'}, gkdStatus: {clubOId}, where}
      const club: ClubInfoType = {
        commOId: clubDB.commOId,
        clubOId: clubOId,
        name: clubDB.name,
        weekRowsArr: clubDB.weekRowsArr,
        chatRoomOId: clubDB.chatRoomOId,
        docOId: clubDB.docOId
      }
      return {club}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readClubByName(where: string, commOId: string, name: string) {
    where = where + '/readClubByName'
    try {
      const clubDB = await this.clubModel.findOne({commOId, name})
      if (!clubDB) {
        throw {gkd: {club: '이런 클럽이 없네요 ㅠㅠ'}, gkdStatus: {commOId, name}, where}
      }
      const club: ClubInfoType = {
        commOId,
        name,
        clubOId: clubDB._id.toString(),
        weekRowsArr: clubDB.weekRowsArr,
        chatRoomOId: clubDB.chatRoomOId,
        docOId: clubDB.docOId
      }
      return {club}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readClubCreatePrevLimit(where: string, clubOId: string) {
    try {
      const _id = new Types.ObjectId(clubOId)
      const clubDB = await this.clubModel.findOne({_id})
      const {lastAddPrevWeekDate, numOfAddedPrevWeek} = clubDB
      return {lastAddPrevWeekDate, numOfAddedPrevWeek}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readClubsArrByClubOIdsArr(where: string, clubOIdsArr: string[]) {
    try {
      const clubsArr: ClubInfoType[] = []
      for (const clubOId of clubOIdsArr) {
        const _id = new Types.ObjectId(clubOId)
        const clubDB = await this.clubModel.findOne({_id})
        const club: ClubInfoType = {
          commOId: clubDB.commOId,
          clubOId: clubOId,
          name: clubDB.name,
          weekRowsArr: clubDB.weekRowsArr,
          chatRoomOId: clubDB.chatRoomOId,
          docOId: clubDB.docOId
        }
        clubsArr.push(club)
      }
      return {clubsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateClubCreatePrevLimit(
    where: string,
    clubOId: string,
    todayValue: number,
    newValue: number
  ) {
    where = where + '/updateClubCreatePrevLimit'
    try {
      const _id = new Types.ObjectId(clubOId)
      const res = await this.clubModel.updateOne(
        {_id},
        {$set: {lastAddPrevWeekDate: todayValue, numOfAddedPrevWeek: newValue}}
      )
      if (res.modifiedCount === 0)
        throw {gkd: {etc: '왜 바뀐게 없을까'}, gkdStatus: {clubOId, todayValue, newValue}, where}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateClubsChatRoomOId(where: string, clubOId: string, chatRoomOId: string) {
    try {
      const _id = new Types.ObjectId(clubOId)
      await this.clubModel.updateOne({_id}, {chatRoomOId})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateClubWeekRowsArrPop(where: string, clubOId: string, idx: number) {
    where = where + '/updateClubWeekRowsArrPop'
    try {
      const _id = new Types.ObjectId(clubOId)

      // 클럽 정보를 가져와서 배열 수정
      const club = await this.clubModel.findOne({_id})
      if (!club) throw {gkd: {clubOId: '이런 클럽은 없어요'}, gkdStatus: {clubOId}, where}

      const {weekRowsArr} = club
      if (idx < 0 || idx >= weekRowsArr.length) {
        throw {idx: '유효하지 않은 인덱스입니다', gkdStatus: {clubOId, idx}, where}
      }

      // 특정 인덱스 제거
      weekRowsArr.splice(idx, 1)

      // 업데이트
      const res = await this.clubModel.updateOne(
        {_id},
        {
          $set: {
            weekRowsArr
          }
        }
      )

      if (res.modifiedCount !== 1) {
        throw {
          gkd: {cnt: `왜 ${res.modifiedCount} 개가 업데이트되지?`},
          gkdStatus: {clubOId},
          where
        }
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateClubWeekRowsArrPushBack(
    where: string,
    clubOId: string,
    weekOId: string,
    start: number,
    end: number
  ) {
    where = where + '/updateClubWeekRowsArrPushBack'
    try {
      const _id = new Types.ObjectId(clubOId)
      const clubDB = await this.clubModel.findOne({_id})
      if (!clubDB) throw {gkd: {clubOId: '이런 클럽은 없어요'}, gkdStatus: {clubOId}, where}

      const newWeekRow = new this.weekRowModel({weekOId, start, end, title: ''}, where)
      await this.clubModel.updateOne(
        {_id},
        {
          $push: {weekRowsArr: newWeekRow}
        }
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateClubWeekRowsArrPushFront(
    where: string,
    clubOId: string,
    weekOId: string,
    start: number,
    end: number
  ) {
    where = where + '/updateClubWeekRowsArrPushFront'
    try {
      const _id = new Types.ObjectId(clubOId)
      const clubDB = await this.clubModel.findOne({_id})
      if (!clubDB) throw {gkd: {clubOId: '이런 클럽은 없어요'}, gkdStatus: {clubOId}, where}

      const newWeekRow = new this.weekRowModel({weekOId, start, end, title: ''})
      await this.clubModel.updateOne(
        {_id},
        {
          $push: {
            weekRowsArr: {
              $each: [newWeekRow],
              $position: 0 // 배열의 맨 앞에 추가
            }
          }
        }
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteClubByClubOId(where: string, clubOId: string) {
    where = where + '/deleteClubByClubOId'
    try {
      const _id = new Types.ObjectId(clubOId)
      await this.clubModel.deleteOne({_id})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
