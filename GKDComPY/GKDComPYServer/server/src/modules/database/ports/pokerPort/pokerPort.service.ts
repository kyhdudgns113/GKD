import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub/databaseHub.service'
import {
  AddPokerUserDataType,
  SavePokerUsersArrDataType,
  SaveSettingDataType
} from 'src/common/types'

/**
 * 권한체크 이 모듈에서 한다.
 * 몇몇 함수는 권한체크가 없을 수 있다.
 * - 로그인 같은건 권한체크 하면 안되지...
 */
@Injectable()
export class PokerPortService {
  constructor(private readonly dbHubService: DatabaseHubService) {}

  async addPokerUser(data: AddPokerUserDataType) {
    const where = '/poker/addPokerUser'
    try {
      // 입력 에러 체크 뙇!!
      const {name} = data
      if (!name) throw {gkd: {name: '이름이 비었어요'}, gkdStatus: {name}, where}
      if (name.length > 10) throw {gkd: {length: '이름이 너무 길어요'}, gkdStatus: {name}, where}

      // 중복체크 뙇!!
      const {pokerUser: isExist} = await this.dbHubService.readPokerUserByName(where, name)
      if (isExist) {
        throw {gkd: {name: `이미 이런 유저가 존재해요`}, gkdStatus: {name}, where}
      }

      // 포커유저 추가 뙇!!
      await this.dbHubService.createPokerUser(where, name)

      // 리턴용 오브젝트, 배열 뙇!!
      const {pokerUsers, pokerUsersArr} = await this.dbHubService.readPokerUsersAndArr(where)

      return {pokerUsers, pokerUsersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deletePokerUser(pUOId: string) {
    const where = `/poker/deletePokerUser`
    try {
      // 삭제 뙇!!
      await this.dbHubService.deletePokerUser(where, pUOId)

      // 리턴용 오브젝트, 배열 뙇!!
      const {pokerUsers, pokerUsersArr} = await this.dbHubService.readPokerUsersAndArr(where)
      return {pokerUsers, pokerUsersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async loadGameSetting() {
    const where = '/poker/readGameSetting'
    try {
      const {setting} = await this.dbHubService.readGameSetting(where)
      if (!setting) {
        throw {gkd: {setting: '설정이 없어요'}, gkdStatus: {statusNull: null}, where}
      }
      return {setting}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async loadUsers() {
    const where = `/poker/loadUsers`
    try {
      // 리턴용 오브젝트, 배열 뙇!!
      const {pokerUsers, pokerUsersArr} = await this.dbHubService.readPokerUsersAndArr(where)
      return {pokerUsers, pokerUsersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async savePokerUsersArr(data: SavePokerUsersArrDataType) {
    const where = `/poker/savePokerUsersArr`
    try {
      // 배열로 저장 뙇!!
      const {pokerUsersArr: _argArr} = data
      await this.dbHubService.updatePokerUserArr(where, _argArr)

      // 리턴용 오브젝트, 배열 뙇!!
      const {pokerUsers, pokerUsersArr} = await this.dbHubService.readPokerUsersAndArr(where)
      return {pokerUsers, pokerUsersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateGameSetting(data: SaveSettingDataType) {
    const where = '/poker/updateGameSetting'
    try {
      const {bigBlind, rebuy, smallBlind} = data
      const {setting: isExist} = await this.dbHubService.readGameSetting(where)

      if (!isExist) {
        const {setting} = await this.dbHubService.createGameSetting(
          where,
          bigBlind,
          rebuy,
          smallBlind
        )
        return {setting}
      } // BLANK LINE COMMENT:
      else {
        const {setting} = await this.dbHubService.updateGameSetting(
          where,
          bigBlind,
          rebuy,
          smallBlind
        )

        return {setting}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
