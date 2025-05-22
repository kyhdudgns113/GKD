import {Body, Controller, Get, Headers, Param, Post, UseGuards} from '@nestjs/common'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {ClientPostingService} from './client.posting.service'
import * as HTTP from 'src/common/types/httpDataTypes'

@Controller('/client/posting')
export class ClientPostingController {
  constructor(private readonly clientPostingService: ClientPostingService) {}

  @Post('/addDirectory')
  @UseGuards(CheckJwtValidationGuard)
  async addDirectory(@Headers() headers: any, @Body() data: HTTP.AddDirectoryDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.addDirectory(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/getRootDir')
  // @UseGuards(CheckJwtValidationGuard) // 아 이건 jwt 필요없지...
  async getRootDir(@Headers() headers: any) {
    const {ok, body, errObj} = await this.clientPostingService.getRootDir()
    return {ok, body, errObj}
  }
}
