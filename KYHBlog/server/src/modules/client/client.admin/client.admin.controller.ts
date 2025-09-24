import {Body, Controller, Get, Headers, Param, Post, UseGuards} from '@nestjs/common'
import {ClientAdminService} from './client.admin.service'
import {CheckAdminGuard} from '@common/guards'

@Controller('/client/admin')
export class ClientAdminController {
  constructor(private readonly clientService: ClientAdminService) {}

  @Get('/loadUserArr')
  @UseGuards(CheckAdminGuard)
  async loadUserArr(@Headers() headers: any) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadUserArr(jwtPayload)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }
}
