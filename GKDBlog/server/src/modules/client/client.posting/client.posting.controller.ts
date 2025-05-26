import {Body, Controller, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {ClientPostingService} from './client.posting.service'

import * as HTTP from 'src/common/types/httpDataTypes'

@Controller('/client/posting')
export class ClientPostingController {
  constructor(private readonly clientPostingService: ClientPostingService) {}

  // POST AREA:
  @Post('/addDirectory')
  @UseGuards(CheckJwtValidationGuard)
  async addDirectory(@Headers() headers: any, @Body() data: HTTP.AddDirectoryDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.addDirectory(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post('/addFile')
  @UseGuards(CheckJwtValidationGuard)
  async addFile(@Headers() headers: any, @Body() data: HTTP.AddFileDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.addFile(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:
  @Put('/setDirName')
  @UseGuards(CheckJwtValidationGuard)
  async setDirName(@Headers() headers: any, @Body() data: HTTP.SetDirNameDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.setDirName(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('/getDirectoryInfo/:dirOId')
  // @UseGuards(CheckJwtValidationGuard) // 아 이것도 jwt 필요없다.
  async getDirectoryInfo(@Param('dirOId') dirOId: string) {
    const {ok, body, errObj} = await this.clientPostingService.getDirectoryInfo(dirOId)
    return {ok, body, errObj}
  }

  @Get('/getRootDir')
  // @UseGuards(CheckJwtValidationGuard) // 아 이건 jwt 필요없지...
  async getRootDir(@Headers() headers: any) {
    const {ok, body, errObj} = await this.clientPostingService.getRootDir()
    return {ok, body, errObj}
  }
}
