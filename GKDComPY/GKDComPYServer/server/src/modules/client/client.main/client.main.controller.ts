import {Body, Controller, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientMainService} from './client.main.service'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {
  AddClubDataType,
  AddUserDataType,
  ModifySelfInfoDataType,
  SetMemberInfoDataType,
  SetUserInfoDataType
} from 'src/common/types'

@Controller('client/main')
export class ClientMainController {
  constructor(private readonly mainService: ClientMainService) {}

  // POST AREA:
  @Post(`/addBanClub`)
  @UseGuards(CheckJwtValidationGuard)
  async addBanClub(@Headers() headers: any, @Body() data: AddClubDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.mainService.addBanClub(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post(`/addClub`)
  @UseGuards(CheckJwtValidationGuard)
  async addClub(@Headers() headers: any, @Body() data: AddClubDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.mainService.addClub(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post('/addUser')
  @UseGuards(CheckJwtValidationGuard)
  async addUser(@Headers() headers: any, @Body() data: AddUserDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.mainService.addUser(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:
  @Put(`/modifySelf`)
  @UseGuards(CheckJwtValidationGuard)
  async modifySelf(@Headers() headers: any, @Body() data: ModifySelfInfoDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.mainService.modifySelf(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put('/modifyUser')
  @UseGuards(CheckJwtValidationGuard)
  async modifyUser(@Headers() headers: any, @Body() data: SetUserInfoDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.mainService.modifyUser(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put('/setMemberInfo')
  @UseGuards(CheckJwtValidationGuard)
  async setMemberInfo(@Headers() headers: any, @Body() data: SetMemberInfoDataType) {
    const {jwtPayload, jwtFromServer} = headers
    const {ok, body, errObj} = await this.mainService.setMemberInfo(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('/getDailyRecordsArr/:memOId/:range')
  @UseGuards(CheckJwtValidationGuard)
  async getDailyRecordsArr(
    @Headers() headers: any,
    @Param('memOId') memOId: string,
    @Param('range') range: number
  ) {
    const {jwtPayload, jwtFromServer} = headers
    const {ok, body, errObj} = await this.mainService.getDailyRecordsArr(jwtPayload, memOId, range)
    return {ok, body, errObj, jwtFromServer}
  }
  @Get('/getEntireMembers/:commOId')
  @UseGuards(CheckJwtValidationGuard)
  async getEntireMembers(@Headers() headers: any, @Param('commOId') commOId: string) {
    const {jwtPayload, jwtFromServer} = headers
    const {ok, body, errObj} = await this.mainService.getEntireMembers(jwtPayload, commOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
