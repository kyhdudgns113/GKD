import {Body, Controller, Get, Headers, Param, Post, Req, Res, UseGuards} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'
import {Response} from 'express'

import {GoogleUserType} from '@common/types'
import {clientIP} from '@secret'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'

import {ClientAuthService} from './client.auth.service'

import * as D from '@common/types/httpDataTypes'

@Controller('/client/auth')
export class ClientAuthController {
  constructor(private readonly clientAuthService: ClientAuthService) {}

  // AREA1: 토큰 필요 없는 함수들
  @Post('/logIn')
  async logIn(@Body() data: D.LogInDataType) {
    const {ok, body, errObj, jwtFromServer} = await this.clientAuthService.logIn(data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Post('/signUp')
  async signUp(@Body() data: D.SignUpDataType) {
    const {ok, body, errObj, jwtFromServer} = await this.clientAuthService.signUp(data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/signUpGoogle')
  @UseGuards(AuthGuard('google'))
  async signUpGoogle(@Req() req) {
    // Redirecting to google automatically
  }

  @Get('/signUpGoogleCallback')
  @UseGuards(AuthGuard('google'))
  async signUpGoogleCallback(@Req() req, @Res() res: Response) {
    const user: GoogleUserType = req.user
    const {userId, userName, picture} = user

    const {ok, body, errObj} = await this.clientAuthService.signUpGoogleCallback(userId, userName, picture)

    if (!ok) {
      res.redirect(`${clientIP}/redirect/errMsg/${errObj}`)
    } // ::
    else {
      const {jwtFromServer} = body
      res.redirect(`${clientIP}/redirect/google/${jwtFromServer}`)
    }
  }

  // AREA2: 토큰 필요 있는 함수들
  @Get('/refreshToken')
  @UseGuards(CheckJwtValidationGuard)
  async refreshToken(@Headers() headers: any) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientAuthService.refreshToken(jwtPayload)

    return {ok, body, errObj, jwtFromServer}
  }
}
