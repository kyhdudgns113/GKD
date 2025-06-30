import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common'
import {ClientDefaultService} from './client.default.service'

@Controller('client/default')
export class ClientDefaultController {
  constructor(private readonly clientService: ClientDefaultService) {}

  @Get('/readIntroFile')
  async readIntroFile(@Headers() headers: any) {
    const {ok, body, errObj} = await this.clientService.readIntroFile()
    return {ok, body, errObj}
  }
}
