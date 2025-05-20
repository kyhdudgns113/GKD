import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import {GameSettingDB} from './gameSettingDB.entity'
import {PokerSettingType} from 'src/common/types'

@Injectable()
export class GameSettingDBService {
  constructor(@InjectModel(GameSettingDB.name) private gameSettingDBModel: Model<GameSettingDB>) {}

  async createGameSetting(where: string, bigBlind: number, rebuy: number, smallBlind: number) {
    where = where + '/createGameSetting.entity'
    try {
      const prevDB = await this.gameSettingDBModel.findOne()
      if (prevDB) {
        const {bigBlind, rebuy, smallBlind} = prevDB
        throw {
          gkd: {alreadyExist: '이미 설정이 존재해요'},
          gkdStatus: {bigBlind, rebuy, smallBlind},
          where
        }
      }
      const newSetting = new this.gameSettingDBModel({bigBlind, rebuy, smallBlind})
      await newSetting.save()

      const setting: PokerSettingType = {bigBlind, rebuy, smallBlind}
      return {setting}

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readGameSetting(where: string) {
    try {
      const settingDB = await this.gameSettingDBModel.findOne()
      if (!settingDB) {
        return {setting: null}
      }
      const {bigBlind, rebuy, smallBlind} = settingDB
      const setting: PokerSettingType = {bigBlind, rebuy, smallBlind}
      return {setting}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateGameSetting(where: string, bigBlind: number, rebuy: number, smallBlind: number) {
    try {
      await this.gameSettingDBModel.updateOne({}, {bigBlind, rebuy, smallBlind})
      const setting: PokerSettingType = {bigBlind, rebuy, smallBlind}
      return {setting}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
