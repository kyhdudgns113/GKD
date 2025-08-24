import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common'
import {ClientFileService} from './client.file.service'

@Controller('/client/file')
export class ClientFileController {
  constructor(private readonly clientService: ClientFileService) {}

  @Get('/loadFile/:fileOId')
  async loadFile(@Param('fileOId') fileOId: string) {
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadFile(fileOId)
    return {ok, body, gkdErrMsg, statusCode}
  }
}
