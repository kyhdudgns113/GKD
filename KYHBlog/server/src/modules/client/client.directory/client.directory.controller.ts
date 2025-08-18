import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common'
import {ClientDirectoryService} from './client.directory.service'

@Controller('/client/directory')
export class ClientDirectoryController {
  constructor(private readonly clientService: ClientDirectoryService) {}

  // GET AREA:

  @Get('/loadRootDirectory')
  async loadRootDirectory() {
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadRootDirectory()
    return {ok, body, gkdErrMsg, statusCode}
  }
}
