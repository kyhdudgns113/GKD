import {Body, Controller, Get, Headers, Post, UseGuards} from '@nestjs/common'
import {AdminLogListService} from './admin.logList.service'
import {CheckAdminGuard} from 'src/common/guards'

@Controller('admin/logList')
export class AdminLogListController {
  constructor(private readonly logService: AdminLogListService) {}

  // POST AREA:
  @Get('/getLogsArr')
  @UseGuards(CheckAdminGuard)
  async getLogsArr(@Headers() headers: any) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.logService.getLogsArr(jwtPayload)
    return {ok, body, errObj, jwtFromServer}
  }
  @Get('/getUsers')
  @UseGuards(CheckAdminGuard)
  async getUsers(@Headers() headers: any) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.logService.getUsers(jwtPayload)
    return {ok, body, errObj, jwtFromServer}
  }
}
