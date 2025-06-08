import {Body, Controller, Get, Headers, Param, Post, UseGuards} from '@nestjs/common'
import {ClientReadingService} from './client.reading.service'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'

@Controller('client/reading')
export class ClientReadingController {
  constructor(private readonly clientService: ClientReadingService) {}

  @Get('/readFile/:fileOid')
  // @UseGuards(CheckJwtValidationGuard) // 회원 아니어도 읽을 수 있게 할까...?
  async readFile(@Param('fileOid') fileOid: string) {
    const {ok, body, errObj} = await this.clientService.readFile(fileOid)
    return {ok, body, errObj}
  }
}
