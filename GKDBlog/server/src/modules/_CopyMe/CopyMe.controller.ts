import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common'
import {CopyMeService} from './CopyMe.service'

@Controller('copyMe')
export class CopyMeController {
  constructor(private readonly copyMeService: CopyMeService) {}

  @Post('/copyPost')
  async copyPost(@Headers() headers: any, @Body() copyData: any) {
    const {jwtFromHeader, jwtPayload} = headers
    const {ok, body, errObj} = await this.copyMeService.copyMePost(jwtPayload, copyData)
    return {ok, body, errObj, jwtFromHeader}
  }

  @Get('/copyGet/:testArg')
  async copyGet(@Headers() headers: any, @Param('testArg') testArg: any) {
    const {jwtFromHeader, jwtPayload} = headers
    const {ok, body, errObj} = await this.copyMeService.copyMePost(jwtPayload, testArg)
    return {ok, body, errObj, jwtFromHeader}
  }
}
