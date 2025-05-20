import {Injectable} from '@nestjs/common'
import {PokerPortService} from '../database/ports/pokerPort'
import {
  AddPokerUserDataType,
  SavePokerUsersArrDataType,
  SaveSettingDataType
} from 'src/common/types'

@Injectable()
export class PokerService {
  constructor(private readonly portService: PokerPortService) {}

  // POST AREA:
  async addPokerUser(data: AddPokerUserDataType) {
    try {
      const {pokerUsers, pokerUsersArr} = await this.portService.addPokerUser(data)
      return {ok: true, body: {pokerUsers, pokerUsersArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      return {ok: false, body: {}, errObj}
    }
  }

  // PUT AREA:
  async savePokerUsersArr(data: SavePokerUsersArrDataType) {
    try {
      const {pokerUsers, pokerUsersArr} = await this.portService.savePokerUsersArr(data)
      return {ok: true, body: {pokerUsers, pokerUsersArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      return {ok: false, body: {}, errObj}
    }
  }
  async updateGameSetting(data: SaveSettingDataType) {
    try {
      const {setting} = await this.portService.updateGameSetting(data)
      return {ok: true, body: {setting}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      return {ok: false, body: {}, errObj}
    }
  }

  // GET AREA:
  async loadGameSetting() {
    try {
      const {setting} = await this.portService.loadGameSetting()
      return {ok: true, body: {setting}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      return {ok: false, body: {}, errObj}
    }
  }
  async loadUsers() {
    try {
      const {pokerUsers, pokerUsersArr} = await this.portService.loadUsers()
      return {ok: true, body: {pokerUsers, pokerUsersArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // DELETE AREA:
  async deletePokerUser(pUOId: string) {
    try {
      const {pokerUsers, pokerUsersArr} = await this.portService.deletePokerUser(pUOId)
      return {ok: true, body: {pokerUsers, pokerUsersArr}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      return {ok: false, body: {}, errObj}
    }
  }
}
