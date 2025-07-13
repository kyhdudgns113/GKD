import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {User} from './userDB.entity'
import {Model, Types} from 'mongoose'

import * as bcrypt from 'bcrypt'
import {UserInfoType} from '../../../../common/types'
import {gkdSaltOrRounds} from '../../../../common/secret'

@Injectable()
export class UserDBService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(where: string, id: string, password: string, commOId?: string) {
    try {
      const hashedPassword = bcrypt.hashSync(password, gkdSaltOrRounds)
      if (commOId) {
        const newUser = new this.userModel({id, commOId, hashedPassword})
        await newUser.save()
      } // BLANK LINE COMMENT:
      else {
        const newUser = new this.userModel({id, hashedPassword})
        await newUser.save()
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readUserByIdPassword(where: string, id: string, password: string) {
    where = where + '/readUserByIdPassword'
    try {
      const userId = await this.userModel.findOne({id})
      if (userId) {
        if (!bcrypt.compareSync(password, userId.hashedPassword)) {
          throw {gkd: {password: '비밀번호가 틀렸어요.'}, gkdStatus: {id}, where}
        }
        const user: UserInfoType = {
          uOId: userId._id.toString(),
          id: userId.id,
          commOId: userId.commOId,
          unreadMessages: userId.unreadMessages
        }
        return {user}
      }

      throw {gkd: {id: '그런 유저는 없습니다'}, gkdStatus: {id}, where}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUserByUOId(where: string, uOId: string) {
    try {
      const _id = new Types.ObjectId(uOId)
      const userDB = await this.userModel.findOne({_id})

      if (!userDB) return {user: null}

      const user: UserInfoType = {
        uOId: uOId,
        id: userDB.id,
        commOId: userDB.commOId,
        unreadMessages: userDB.unreadMessages
      }
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUsers(where: string) {
    try {
      const usersArrDB = await this.userModel.find()
      const users: {[uOId: string]: UserInfoType} = {}
      usersArrDB.forEach(user => {
        const uOId = user._id.toString()
        const elem: UserInfoType = {
          uOId: uOId,
          id: user.id,
          commOId: user.commOId,
          unreadMessages: user.unreadMessages
        }
        users[uOId] = elem
      })
      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUsersArrByCommOId(where: string, commOId: string) {
    where = where + '/readUsersArrByCommOId'
    try {
      if (commOId === 'admin') {
        throw {
          gkd: {admin: 'admin 의 유저목록을 도대체 왜 불러오려고 하는거죠?'},
          gkdStatus: {commOId},
          where
        }
      }
      const usersArrDB = await this.userModel.find({commOId})
      const usersArr: UserInfoType[] = usersArrDB.map(user => {
        const elem: UserInfoType = {
          uOId: user._id.toString(),
          id: user.id,
          commOId: user.commOId,
          unreadMessages: user.unreadMessages
        }
        return elem
      })
      return {usersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateUser(
    where: string,
    commOId: string,
    uOId: string,
    id: string,
    password: string,
    authVal: number | null
  ) {
    where = where + '/updateMember'
    try {
      const userDB = await this.userModel.findOne({commOId, id})
      if (userDB)
        throw {gkd: {id: '이미 존재하는 운영진 이름입니다 ㅠㅠ'}, gkdStatus: {commOId, id}, where}

      const _id = new Types.ObjectId(uOId)
      const query: Record<string, any> = {}
      if (id) {
        query.id = id
      }
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, gkdSaltOrRounds)
        query.hashedPassword = hashedPassword
      }
      if (authVal !== null) {
        query.authVal = authVal
      }

      await this.userModel.updateOne({_id}, {$set: query})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateUserSelf(
    where: string,
    uOId: string,
    id: string,
    prevPassword: string,
    newPassword: string
  ) {
    where = where + '/updateUserSelf'
    try {
      const _id = new Types.ObjectId(uOId)

      const query: Record<string, any> = {}

      if (id) query.id = id
      if (newPassword) {
        const userDB = await this.userModel.findOne({_id})
        if (!userDB)
          throw {gkd: {uOId: '자기 자신을 잘 못넘겨주는편...'}, gkdStatus: {uOId, id}, where}
        if (!bcrypt.compareSync(prevPassword, userDB.hashedPassword)) {
          throw {gkd: {password: '비밀번호가 틀렸어요 ㅠㅠ'}, gkdStatus: {id}, where}
        }
        const hashedPassword = bcrypt.hashSync(newPassword, gkdSaltOrRounds)
        query.hashedPassword = hashedPassword
      }

      await this.userModel.updateOne({_id}, {$set: query})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateUserUnreadMessages(where: string, uOId: string, chatRoomOId: string) {
    where = where + '/updateUserUnreadMessages'
    try {
      const _id = new Types.ObjectId(uOId)
      const userDB = await this.userModel.findOne({_id})
      if (!userDB)
        throw {gkd: {uOId: '이런 유저가 왜 없는걸까요'}, gkdStatus: {uOId, chatRoomOId}, where}
      await this.userModel.updateOne(
        {_id},
        {$set: {[`unreadMessages.${chatRoomOId}`]: (userDB.unreadMessages[chatRoomOId] || 0) + 1}}
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteUserByUOId(where: string, uOId: string) {
    where = where + '/deleteUserByUOId'
    try {
      const _id = new Types.ObjectId(uOId)
      const res = await this.userModel.deleteOne({_id})
      if (res.deletedCount == 0) {
        throw {gkd: {delError: '유저가 유저DB에서 지워지지 않았어요.'}, gkdStatus: {uOId}, where}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteUsersUnreadMessageCnt(where: string, uOId: string, chatRoomOId: string) {
    try {
      const _id = new Types.ObjectId(uOId)
      const userFromDB = await this.userModel.findOne({_id})
      const {unreadMessages} = userFromDB

      delete unreadMessages[chatRoomOId]

      await this.userModel.updateOne({_id}, {$set: {unreadMessages}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
