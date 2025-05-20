import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import {EMemberType} from '../../../../common/types'
import {EMember, EMemberArr} from './eMemberDB.entity'

@Injectable()
export class EMemberDBService {
  constructor(
    @InjectModel(EMember.name) private memberModel: Model<EMember>,
    @InjectModel(EMemberArr.name) private arrModel: Model<EMemberArr>
  ) {}

  async createEMemArr(
    where: string,
    commOId: string,
    clubOId: string,
    colIdx: number,
    eMembersArr: EMemberType[]
  ) {
    try {
      const newArr = new this.arrModel({commOId, clubOId, colIdx, eMembersArr})
      await newArr.save()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readEMemArr(where: string, commOId: string, colIdx: number) {
    where = where + '/readEMemArr'
    try {
      const arrDB = await this.arrModel.findOne({commOId, colIdx})
      if (!arrDB) {
        return {gkd: {colIdx: '이런거 없다고 나오는데요?'}, gkdStatus: {commOId, colIdx}, where}
      }
      const eMembersArr: EMemberType[] = arrDB.eMembersArr.map((memInfo, memIdx) => {
        const {batterPower, clubOId, colIdx, commOId} = memInfo
        const {memberComment, memOId, name, position, pitcherPower} = memInfo
        const elem: EMemberType = {
          batterPower,
          clubOId,
          colIdx,
          commOId,
          memberComment,
          memOId,
          name,
          position,
          pitcherPower
        }
        return elem
      })
      if (!eMembersArr) return {eMembersArr: []}
      return {eMembersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateEMemArr(
    where: string,
    commOId: string,
    clubOId: string,
    colIdx: number,
    eMembersArr: EMemberType[]
  ) {
    try {
      const res = await this.arrModel.updateOne({commOId, colIdx}, {$set: {clubOId, eMembersArr}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 클럽을 지운다던가 하면 이거 해줘야됨
   */
  async updateEMemArrColIdx(where: string, commOId: string, prevIdx: number, nextIdx: number) {
    try {
      const res = await this.arrModel.updateOne(
        {commOId, colIdx: prevIdx},
        {$set: {colIdx: nextIdx}}
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateEMemArrColIdxByClubOId(where: string, clubOId: string, nextIdx: number) {
    try {
      const res = await this.arrModel.updateOne({clubOId}, {$set: {colIdx: nextIdx}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteEMemArr(where: string, commOId: string, clubOId: string) {
    try {
      await this.arrModel.deleteOne({commOId, clubOId})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
