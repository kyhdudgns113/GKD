import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {AdminCommunityService} from './admin.community.service'
import {CheckAdminGuard} from 'src/common/guards'
import {
  AddClubDataType,
  AddCommDataType,
  AddUserDataType,
  ChangeCommNameDataType,
  SetCommAuthDataType,
  SetCommMaxClubsDataType,
  SetCommMaxUsersDataType
} from 'src/common/types'

@Controller('admin/community')
export class AdminCommunityController {
  constructor(private readonly commService: AdminCommunityService) {}

  // POST AREA:
  @Post('/addBanClub')
  @UseGuards(CheckAdminGuard)
  async addBanClub(@Headers() headers: any, @Body() data: AddClubDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.addBanClub(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post('/addClub')
  @UseGuards(CheckAdminGuard)
  async addClub(@Headers() headers: any, @Body() data: AddClubDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.addClub(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post('/addComm')
  @UseGuards(CheckAdminGuard)
  async addComm(@Headers() headers: any, @Body() data: AddCommDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.addComm(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post('/addUser')
  @UseGuards(CheckAdminGuard)
  async addUser(@Headers() headers: any, @Body() data: AddUserDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.addUser(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:
  @Put('/changeName')
  @UseGuards(CheckAdminGuard)
  async changeName(@Headers() headers: any, @Body() data: ChangeCommNameDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.changeName(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put('/setCommMaxClubs')
  @UseGuards(CheckAdminGuard)
  async setCommMaxClubs(@Headers() headers: any, @Body() data: SetCommMaxClubsDataType) {
    const {jwtPayload, jwtFromServer} = headers
    const {ok, body, errObj} = await this.commService.setCommMaxClubs(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put('/setCommMaxUsers')
  @UseGuards(CheckAdminGuard)
  async setCommMaxUsers(@Headers() headers: any, @Body() data: SetCommMaxUsersDataType) {
    const {jwtPayload, jwtFromServer} = headers
    const {ok, body, errObj} = await this.commService.setCommMaxUsers(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put('/setUserAuthVal')
  @UseGuards(CheckAdminGuard)
  async setUserAuthVal(@Headers() headers: any, @Body() data: SetCommAuthDataType) {
    const {jwtPayload, jwtFromServer} = headers
    const {ok, body, errObj} = await this.commService.setUserAuthVal(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('/getClubsArr/:commOId')
  @UseGuards(CheckAdminGuard)
  async getClubsArr(@Headers() headers: any, @Param('commOId') commOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.getClubsArr(jwtPayload, commOId)
    return {ok, body, errObj, jwtFromServer}
  }
  @Get('/getComms')
  @UseGuards(CheckAdminGuard)
  async getComms(@Headers() headers: any) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.getComms(jwtPayload)
    return {ok, body, errObj, jwtFromServer}
  }
  @Get('/getUsers/:commOId')
  @UseGuards(CheckAdminGuard)
  async getUsers(@Headers() headers: any, @Param('commOId') commOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.getUsers(jwtPayload, commOId)
    return {ok, body, errObj, jwtFromServer}
  }

  // DELETE AREA:
  @Delete('/delClub/:commOId/:clubOId')
  @UseGuards(CheckAdminGuard)
  async deleteClub(
    @Headers() headers: any,
    @Param('commOId') commOId: string,
    @Param('clubOId') clubOId: string
  ) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.deleteClub(jwtPayload, commOId, clubOId)
    return {ok, body, errObj, jwtFromServer}
  }
  @Delete('/delUser/:commOId/:uOId')
  @UseGuards(CheckAdminGuard)
  async deleteUser(
    @Headers() headers: any,
    @Param('commOId') commOId: string,
    @Param('uOId') uOId: string
  ) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.commService.deleteUser(jwtPayload, commOId, uOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
