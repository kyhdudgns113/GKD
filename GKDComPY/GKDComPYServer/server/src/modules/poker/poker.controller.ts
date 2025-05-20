import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common'
import {
  AddPokerUserDataType,
  SavePokerUsersArrDataType,
  SaveSettingDataType
} from 'src/common/types'
import {PokerService} from './poker.service'

@Controller('/poker')
export class PokerController {
  constructor(private readonly pokerService: PokerService) {}

  // POST AREA:
  @Post('/addPokerUser')
  async addPokerUser(@Body() data: AddPokerUserDataType) {
    const {ok, body, errObj} = await this.pokerService.addPokerUser(data)
    return {ok, body, errObj}
  }

  // PUT AREA:
  @Put('/savePokerUsersArr')
  async savePokerUsersArr(@Body() data: SavePokerUsersArrDataType) {
    const {ok, body, errObj} = await this.pokerService.savePokerUsersArr(data)
    return {ok, body, errObj}
  }
  @Put('/updateGameSetting')
  async updateGameSetting(@Body() data: SaveSettingDataType) {
    const {ok, body, errObj} = await this.pokerService.updateGameSetting(data)
    return {ok, body, errObj}
  }

  // GET AREA:
  @Get('/loadGameSetting')
  async loadGameSetting() {
    const {ok, body, errObj} = await this.pokerService.loadGameSetting()
    return {ok, body, errObj}
  }
  @Get('/loadUsers')
  async loadUsers() {
    const {ok, body, errObj} = await this.pokerService.loadUsers()
    return {ok, body, errObj}
  }

  // DELETE AREA:
  @Delete(`/deletePokerUser/:pUOId`)
  async deletePokerUser(@Param('pUOId') pUOId: string) {
    const {ok, body, errObj} = await this.pokerService.deletePokerUser(pUOId)
    return {ok, body, errObj}
  }
}
