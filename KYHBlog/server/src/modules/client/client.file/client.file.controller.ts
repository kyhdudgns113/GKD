import {Body, Controller, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientFileService} from './client.file.service'
import {CheckAdminGuard} from '@common/guards'
import {EditFileType} from '@common/types'

@Controller('/client/file')
export class ClientFileController {
  constructor(private readonly clientService: ClientFileService) {}

  // PUT AREA:

  @Put('/editFile')
  @UseGuards(CheckAdminGuard)
  async editFile(@Headers() headers: any, @Body() data: EditFileType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.editFile(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // GET AREA:

  @Get('/loadFile/:fileOId')
  async loadFile(@Param('fileOId') fileOId: string) {
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadFile(fileOId)
    return {ok, body, gkdErrMsg, statusCode}
  }
}
