import {Body, Controller, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {AdminUserListService} from './admin.userList.service'
import {CheckAdminGuard} from 'src/common/guards'
import {AddUserDataType, SetCommAuthDataType} from 'src/common/types'

@Controller('admin/userList')
export class AdminUserListController {
  constructor(private readonly userListService: AdminUserListService) {}

  // POST AREA:
  @Post(`/addUser`)
  @UseGuards(CheckAdminGuard)
  async addUser(@Headers() headers: any, @Body() data: AddUserDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.userListService.addUser(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:
  @Put(`/setUserCommAuth`)
  @UseGuards(CheckAdminGuard)
  async setUserCommAuth(@Headers() headers: any, @Body() data: SetCommAuthDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.userListService.setUserCommAuth(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get(`getAuthval/:commOId/:uOId`)
  @UseGuards(CheckAdminGuard)
  async getAuthVal(
    @Headers() headers: any,
    @Param('commOId') commOId: string,
    @Param('uOId') uOId: string
  ) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.userListService.getAuthVal(jwtPayload, commOId, uOId)
    return {ok, body, errObj, jwtFromServer}
  }
  @Get(`/getCommName/:commOId`)
  @UseGuards(CheckAdminGuard)
  async getCommName(@Headers() headers: any, @Param('commOId') commOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.userListService.getCommName(jwtPayload, commOId)
    return {ok, body, errObj, jwtFromServer}
  }
  @Get(`/getCommsRows`)
  @UseGuards(CheckAdminGuard)
  async getCommsRows(@Headers() headers: any) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.userListService.getCommsRows(jwtPayload)
    return {ok, body, errObj, jwtFromServer}
  }
  @Get('/getUsers')
  @UseGuards(CheckAdminGuard)
  async getUsers(@Headers() headers: any) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.userListService.getUsers(jwtPayload)
    return {ok, body, errObj, jwtFromServer}
  }
}
