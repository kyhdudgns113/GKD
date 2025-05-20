import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {Community} from './communityDB.entity'
import {CommunityInfoType} from '../../../../common/types'

@Injectable()
export class CommunityDBService {
  constructor(@InjectModel(Community.name) private commModel: Model<Community>) {}

  async createCommunity(where: string, name: string) {
    where = where + '/createCommunity'
    try {
      const newCommunity = new this.commModel({name})
      await newCommunity.save()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readCommByCommOId(where: string, commOId: string) {
    where = where + '/readCommByCommOId'
    try {
      if (commOId === 'admin') {
        throw {gkd: {commOId: '관리자를 뭐하러 읽어오려 하십니까'}, gkdStatus: {commOId}, where}
      }
      const _id = new Types.ObjectId(commOId)
      const commDB = await this.commModel.findOne({_id})
      if (!commDB) {
        throw {gkd: {commOId: '이런 공동체는 존재하지 않아요'}, gkdStatus: {commOId}, where}
      }
      const comm: CommunityInfoType = {
        commOId: commOId,
        name: commDB.name,
        users: commDB.users,
        clubOIdsArr: commDB.clubOIdsArr,
        banClubOId: commDB.banClubOId,
        maxUsers: commDB.maxUsers,
        maxClubs: commDB.maxClubs
      }
      return {comm}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readCommByName(where: string, name: string) {
    // admin에서 중복체크 할 때 쓴다.
    where = where + '/readCommByName'
    try {
      const commDB = await this.commModel.findOne({name})

      if (!commDB) return {comm: null}

      const commOId = commDB._id.toString()
      const {users, clubOIdsArr, maxUsers, maxClubs, banClubOId} = commDB
      const comm: CommunityInfoType = {
        commOId,
        name,
        users,
        clubOIdsArr,
        maxUsers,
        maxClubs,
        banClubOId
      }

      return {comm}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readComms(where: string) {
    try {
      const commsArrDB = await this.commModel.find()
      const comms: {[commOId: string]: CommunityInfoType} = {}
      commsArrDB.forEach(comm => {
        const commOId = comm._id.toString()
        // 나중에 확장할때 편리성을 위해서라도 elem 을 만든다.
        const elem: CommunityInfoType = {
          commOId,
          name: comm.name,
          users: comm.users,
          clubOIdsArr: comm.clubOIdsArr,
          banClubOId: comm.banClubOId,
          maxUsers: comm.maxUsers,
          maxClubs: comm.maxClubs
        }
        comms[commOId] = elem
      })
      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readCommsArr(where: string) {
    try {
      const commsArrDB = await this.commModel.find()
      const commsArr: CommunityInfoType[] = commsArrDB.map(comm => {
        const elem: CommunityInfoType = {
          commOId: comm._id.toString(),
          name: comm.name,
          users: comm.users,
          clubOIdsArr: comm.clubOIdsArr,
          banClubOId: comm.banClubOId,
          maxUsers: comm.maxUsers,
          maxClubs: comm.maxClubs
        }
        return elem
      })
      return {commsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateCommBCOId(where: string, commOId: string, banClubOId: string) {
    where = where + '/updateCommBCOId'
    try {
      const _id = new Types.ObjectId(commOId)
      const isExist = (await this.commModel.findOne({_id})).banClubOId
      if (isExist) {
        throw {
          gkd: {banClubOId: '이미 탈퇴멤버 클럽이 존재해요'},
          gkdStatus: {commOId, prevBanClubOId: isExist, newBanClubOId: banClubOId},
          where
        }
      }

      await this.commModel.updateOne({_id}, {$set: {banClubOId}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommCOIdsByCOIDs(where: string, commOId: string, _clubOIdsArr: string[]) {
    where = where + '/updateCommCOIdsByCOIDs'
    try {
      const _id = new Types.ObjectId(commOId)
      const commDB = await this.commModel.findOne({_id})
      if (!commDB)
        throw {gkd: {commOId: '이런 공동체가 없다고 나와요'}, gkdStatus: {commOId}, where}
      const clubOIdsArr = _clubOIdsArr.map(clubOId => clubOId)
      await this.commModel.updateOne({_id}, {clubOIdsArr})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommLastClubOIDs(where: string, commOId: string, clubOId: string) {
    where = where + '/updateCommLastClubOIDs'
    try {
      if (commOId === 'admin') {
        throw {gkd: {commOId: '이런거 DB 에 요청하지 마십쇼'}, gkdStatus: {commOId}, where}
      }
      const _id = new Types.ObjectId(commOId)
      const res = await this.commModel.updateOne(
        {_id},
        {
          $push: {clubOIdsArr: clubOId}
        }
      )
      if (res.modifiedCount === 0) {
        throw {gkd: {result: 'DB 업데이트 오류'}, gkdStatus: {commOId, clubOId}, where}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommMaxClubs(where: string, commOId: string, maxClubs: number) {
    try {
      const _id = new Types.ObjectId(commOId)
      await this.commModel.updateOne({_id}, {$set: {maxClubs}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommMaxUsers(where: string, commOId: string, maxUsers: number) {
    try {
      const _id = new Types.ObjectId(commOId)
      await this.commModel.updateOne({_id}, {$set: {maxUsers}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommName(where: string, commOId: string, name: string) {
    where = where + '/updateCommName'
    try {
      const _id = new Types.ObjectId(commOId)
      const res = await this.commModel.updateOne({_id}, {name})
      if (res.modifiedCount < 1) {
        throw {gkd: {commOId: 'entity: 공동체가 없다고 나옵니다'}, gkdStatus: {commOId}, where}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommUserAuth(where: string, commOId: string, uOId: string, authVal: number | null) {
    try {
      const _id = new Types.ObjectId(commOId)
      if (authVal !== null) {
        const res = await this.commModel.updateOne({_id}, {$set: {[`users.${uOId}`]: authVal}})
      } // BLANK LINE COMMENT:
      // authVal 이 null 이면 변경하지 않는다.
      //   - 아디비번 바꿀때 권한이 사라져 버린다.
      // 유저 삭제등의 이유로 권한 내용을 삭제해야하면 deleteCommUserAuthVal 을 사용한다.
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteClubInCommunity(where: string, commOId: string, clubOId: string) {
    try {
      const _id = new Types.ObjectId(commOId)

      const commDB = await this.commModel.findOne({_id})
      const {clubOIdsArr} = commDB
      const newArr = clubOIdsArr.filter(_clubOId => _clubOId !== clubOId)

      await this.commModel.updateOne({_id}, {$set: {clubOIdsArr: newArr}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteCommUser(where: string, commOId: string, uOId: string) {
    where = where + '/deleteCommUser'
    try {
      const _id = new Types.ObjectId(commOId)
      const res = await this.commModel.updateOne({_id}, {$unset: {[`users.${uOId}`]: ''}})
      if (res.modifiedCount == 0) {
        throw {
          gkd: {errComm: '공동체에서 유저가 지워지지 않았어요.'},
          gkdStatus: {commOId, uOId},
          where
        }
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteCommUserAuthVal(where: string, commOId: string, uOId: string) {
    try {
      const _id = new Types.ObjectId(commOId)
      const res = await this.commModel.updateOne({_id}, {$unset: {[`users.${uOId}`]: ''}})
      if (res.modifiedCount < 1)
        throw {gkd: {commOId: '이런 공동체는 DB 에 없습니다.'}, gkdStatus: {commOId}, where}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
