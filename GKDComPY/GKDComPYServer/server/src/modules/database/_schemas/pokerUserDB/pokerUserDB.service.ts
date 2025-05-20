import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {PokerUser} from './pokerUserDB.entity'
import {PokerUserType} from 'src/common/types'

@Injectable()
export class PokerUserDBService {
  constructor(@InjectModel(PokerUser.name) private pokerUserDBModel: Model<PokerUser>) {}

  async createPokerUser(where: string, name: string) {
    try {
      const newPokerUser = new this.pokerUserDBModel({name})
      await newPokerUser.save()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readPokerUserByName(where: string, name: string) {
    where = where + ':entity'
    try {
      const pokerUserDB = await this.pokerUserDBModel.findOne({name})
      if (!pokerUserDB) {
        return {pokerUser: null}
      }
      const {_id, bankroll, createdAt, debts} = pokerUserDB
      const pUOId = _id.toString()
      const pokerUser: PokerUserType = {bankroll, createdAt, debts, name, pUOId}

      return {pokerUser}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readPokerUsersAndArr(where: string) {
    try {
      const arrDB = await this.pokerUserDBModel.find({})
      arrDB.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      const pokerUsers = {}
      const pokerUsersArr: PokerUserType[] = arrDB.map(pokerUser => {
        const pUOId = pokerUser._id.toString()
        const {bankroll, createdAt, debts, name} = pokerUser
        const elem: PokerUserType = {bankroll, createdAt, debts, name, pUOId}
        pokerUsers[pUOId] = elem
        return elem
      })
      pokerUsersArr.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      return {pokerUsers, pokerUsersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updatePokerUserArr(where: string, pokerUsersArr: PokerUserType[]) {
    try {
      const userLen = pokerUsersArr.length
      for (let userIdx = 0; userIdx < userLen; userIdx++) {
        const pokerUser = pokerUsersArr[userIdx]
        const _id = new Types.ObjectId(pokerUser.pUOId)
        const {bankroll, chips, debts, name} = pokerUser
        await this.pokerUserDBModel.updateOne({_id}, {bankroll, chips, debts, name})
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deletePokerUser(where: string, pUOId: string) {
    try {
      const _id = new Types.ObjectId(pUOId)
      const isExist = await this.pokerUserDBModel.findOne({_id})
      if (!isExist) {
        throw {gkd: {pUOId: '이런 유저가 없어요'}, gkdStatus: {pUOId}, where}
      }
      await this.pokerUserDBModel.deleteOne({_id})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
