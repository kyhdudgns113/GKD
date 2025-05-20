import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common'
import {___Service} from './CopyMe.service'

@Controller('___')
export class ___Controller {
  constructor(private readonly ___Service: ___Service) {}

  @Post('/copyPost')
  async copyPost(@Headers() headers: any, @Body() copyData: any) {
    const {jwtFromHeader, jwtPayload} = headers
    const {ok, body, errObj} = await this.___Service.copyMePost(jwtPayload, copyData)
    return {ok, body, errObj, jwtFromHeader}
  }

  @Get('/copyGet/:testArg')
  async copyGet(@Headers() headers: any, @Param('testArg') testArg: any) {
    const {jwtFromHeader, jwtPayload} = headers
    const {ok, body, errObj} = await this.___Service.copyMePost(jwtPayload, testArg)
    return {ok, body, errObj, jwtFromHeader}
  }
}
