import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common'
import {ClientDefaultService} from './client.default.service'
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'

@ApiTags('Client Default')
@Controller('client/default')
export class ClientDefaultController {
  constructor(private readonly clientService: ClientDefaultService) {}

  @Get('/readIntroFile')
  @ApiOperation({summary: '소개 파일 읽기', description: '소개 파일 읽기'})
  @ApiResponse({status: 200, description: '소개 파일 읽기 성공'})
  @ApiResponse({status: 400, description: '소개 파일 읽기 실패'})
  async readIntroFile(@Headers() headers: any) {
    const {ok, body, errObj} = await this.clientService.readIntroFile()
    return {ok, body, errObj}
  }
}
