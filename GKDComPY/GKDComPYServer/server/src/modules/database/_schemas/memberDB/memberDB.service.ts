import {Injectable} from '@nestjs/common'
import {Model, Types} from 'mongoose'
import {Card, Member} from './memberDB.entity'
import {EMemberType, MemberInfoType} from '../../../../common/types'
import {InjectModel} from '@nestjs/mongoose'

@Injectable()
export class MemberDBService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    @InjectModel(Card.name) private readonly cardModel: Model<Card>
  ) {}

  /**
   * 중복체크는 진작에 해놓는다.
   *
   */
  async createMember(
    where: string,
    commOId: string,
    clubOId: string,
    name: string,
    batterPower: number | null,
    pitcherPower: number | null
  ) {
    where = where + '/createMember'
    try {
      const isExist = await this.memberModel.findOne({where, commOId, clubOId, name})
      if (isExist) {
        throw {
          gkd: {createMember: '도대체 왜 중복이지?'},
          gkdStatus: {commOId, clubOId, name},
          where
        }
      }

      const newMember = new this.memberModel({commOId, clubOId, name, batterPower, pitcherPower})

      await newMember.save()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * 멤버 관리 페이지에서 쓸 멤버 배열형식으로 불러온다.
   */
  async readEMembersArrByClubOId(where: string, clubOId: string, colIdx: number) {
    try {
      const eMembersArrDB = await this.memberModel.find({clubOId})
      const eMembersArr: EMemberType[] = eMembersArrDB.map((member, mIdx) => {
        const {batterPower, commOId, memberComment, name} = member
        const {position, pitcherPower} = member
        const memOId = member._id.toString()
        // BLANK LINE COMMENT:
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
      return {eMembersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readMemberByClubOIdName(where: string, clubOId: string, name: string) {
    where = where + '/readMembersByClubOIdName'
    try {
      if (!clubOId)
        throw {gkd: {clubOId: '이 함수는 Legacy 를 읽지 않아요'}, gkdStatus: {clubOId}, where}

      const memberDB = await this.memberModel.findOne({clubOId, name})

      if (!memberDB) return {member: null}

      const member: MemberInfoType = {
        memOId: memberDB._id.toString(),
        name: memberDB.name,
        commOId: memberDB.commOId,
        clubOId: memberDB.clubOId,
        position: memberDB.position,
        lastRecorded: memberDB.lastRecorded,
        batterPower: memberDB.batterPower,
        pitcherPower: memberDB.pitcherPower,
        deck: memberDB.deck,
        memberComment: memberDB.memberComment
      }
      return {member}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readMemberByMemOId(where: string, memOId: string) {
    where = where + '/readMembersByMemOId'
    try {
      const _id = new Types.ObjectId(memOId)
      const memDB = await this.memberModel.findOne({_id})
      if (!memDB) {
        throw {gkd: {memOId: '이런 유저는 없습니다'}, gkdStatus: {memOId}, where}
      }

      const member: MemberInfoType = {
        memOId: memDB._id.toString(),
        name: memDB.name,
        commOId: memDB.commOId,
        clubOId: memDB.clubOId,
        position: memDB.position,
        lastRecorded: memDB.lastRecorded,
        batterPower: memDB.batterPower,
        pitcherPower: memDB.pitcherPower,
        deck: memDB.deck,
        memberComment: memDB.memberComment
      }
      return {member}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readMembersArrByClubOId(where: string, clubOId: string) {
    where = where + '/readMembersArrByClubOId'
    try {
      if (!clubOId) throw {gkd: {clubOId: '잘못된 클럽 요청입니다.'}, gkdStatus: {clubOId}, where}
      const memberArrDB = await this.memberModel.find({clubOId})
      const membersArr: MemberInfoType[] = memberArrDB.map(member => {
        const elem: MemberInfoType = {
          memOId: member._id.toString(),
          name: member.name,
          commOId: member.commOId,
          clubOId: member.clubOId,
          position: member.position,
          lastRecorded: member.lastRecorded,
          batterPower: member.batterPower,
          pitcherPower: member.pitcherPower,
          deck: member.deck,
          memberComment: member.memberComment
        }
        return elem
      })
      return {membersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readMembersArrOnlyLegacy(where: string, commOId: string, name: string) {
    where = where + '/readMembersArrOnlyLegacy'
    try {
      if (!commOId || commOId === 'admin')
        throw {gkd: {commOId: '잘못된 요청입니다'}, gkdStatus: {commOId}, where}

      const membersArrDB = await this.memberModel.find({commOId, name, clubOId: null})
      const membersArr: MemberInfoType[] = membersArrDB.map(member => {
        const elem: MemberInfoType = {
          memOId: member._id.toString(),
          name: member.name,
          commOId: member.commOId,
          clubOId: member.clubOId,
          position: member.position,
          lastRecorded: member.lastRecorded,
          batterPower: member.batterPower,
          pitcherPower: member.pitcherPower,
          deck: member.deck,
          memberComment: member.memberComment
        }
        return elem
      })
      return {membersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readMembersArrNoLegacy(where: string, commOId: string, name: string) {
    where = where + '/readMembersArrNoLegacy'
    try {
      if (commOId === 'admin')
        throw {gkd: {commOId: '너무 많은 권한을 요청하시면 안됩니다.'}, gkdStatus: {commOId}, where}

      const membersArrDB = await this.memberModel.find({commOId, name, clubOId: {$ne: null}})
      const membersArr: MemberInfoType[] = membersArrDB.map(member => {
        const elem: MemberInfoType = {
          memOId: member._id.toString(),
          name: member.name,
          commOId: member.commOId,
          clubOId: member.clubOId,
          position: member.position,
          lastRecorded: member.lastRecorded,
          batterPower: member.batterPower,
          pitcherPower: member.pitcherPower,
          deck: member.deck,
          memberComment: member.memberComment
        }
        return elem
      })
      return {membersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateMemberCard(
    where: string,
    memOId: string,
    posIdx: number,
    name: string,
    skillIdxs: number[],
    skillLevels: number[]
  ) {
    try {
      const _id = new Types.ObjectId(memOId)
      const newCard = new this.cardModel({name, posIdx, skillIdxs, skillLevels})
      await this.memberModel.updateOne({_id}, {$set: {[`deck.${posIdx}`]: newCard}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMemberComment(where: string, clubOId: string, memOId: string, memberComment: string) {
    where = where + '/updateMemberComment'
    try {
      const _id = new Types.ObjectId(memOId)
      const res = await this.memberModel.updateOne({_id, clubOId}, {$set: {memberComment}})
      if (res.modifiedCount < 1)
        throw {gkd: {etc: '변경되지 않았어요'}, gkdStatus: {clubOId, memOId}, where}
      if (res.modifiedCount > 1)
        throw {gkd: {etc: '왜 많은게 변경되죠?'}, gkdStatus: {clubOId, memOId}, where}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMemberInfo(
    where: string,
    memOId: string,
    name: string,
    batterPower: number | null,
    pitcherPower: number | null,
    clubOId: string | null,
    memberComment: string
  ) {
    where = where + '/updateMemberInfo'
    try {
      const _id = new Types.ObjectId(memOId)

      if (!clubOId) throw {gkd: {clubOId: '클럽 OID 가 없어용'}, where}

      if (name) {
        await this.memberModel.updateOne({_id}, {$set: {name}})
      }
      await this.memberModel.updateOne(
        {_id},
        {$set: {batterPower, pitcherPower, clubOId, memberComment}}
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMembersClub(where: string, memOId: string, clubOId: string) {
    try {
      const _id = new Types.ObjectId(memOId)
      await this.memberModel.updateOne({_id}, {$set: {clubOId}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 멤버 목록에 아무것도 없으면 바뀌는게 없는게 당연하다.
   * 에러가 아니다.
   */
  async updateMembersLastRecorded(where: string, clubOId: string, lastRecorded: number) {
    try {
      await this.memberModel.updateMany({clubOId}, {lastRecorded})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMemPos(where: string, memOId: string, position: number) {
    where = where + '/updateMemPos'
    try {
      const _id = new Types.ObjectId(memOId)
      const result = await this.memberModel.updateOne({_id}, {$set: {position}})
      if (result.modifiedCount === 0)
        throw {gkd: {memOId: '이런 멤버가 없어요'}, gkdStatus: {memOId}, where}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMemPower(
    where: string,
    memOId: string,
    name: string,
    batterPower: number | null,
    pitcherPower: number | null
  ) {
    where = where + '/updateMemPower'
    try {
      const _id = new Types.ObjectId(memOId)
      const res = await this.memberModel.updateOne({_id}, {$set: {name, batterPower, pitcherPower}})
      if (res.modifiedCount === 0)
        throw {gkd: {memOId: '변경이 안되었어요.'}, gkdStatus: {memOId, name}, where}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteMember(where: string, memOId: string) {
    try {
      const _id = new Types.ObjectId(memOId)
      await this.memberModel.deleteOne({_id})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteMembersByClubOId(where: string, clubOId: string) {
    try {
      await this.memberModel.deleteMany({clubOId})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
