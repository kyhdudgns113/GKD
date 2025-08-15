import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common'
import {ClientAuthService} from './client.auth.service'

import * as HTTP from '@httpDataTypes'

@Controller('/client/auth')
export class ClientAuthController {
  constructor(private readonly clientAuthService: ClientAuthService) {}

  // POST AREA:

  @Post('/logIn')
  async logIn(@Body() data: HTTP.LogInDataType) {
    const {ok, body, gkdErrMsg, httpStatus, jwtFromServer} = await this.clientAuthService.logIn(data)
    return {ok, body, gkdErrMsg, httpStatus, jwtFromServer}
  }

  @Post('/signUp')
  async signUp(@Body() data: HTTP.SignUpDataType) {
    const {ok, body, gkdErrMsg, httpStatus, jwtFromServer} = await this.clientAuthService.signUp(data)
    return {ok, body, gkdErrMsg, httpStatus, jwtFromServer}
  }
}
