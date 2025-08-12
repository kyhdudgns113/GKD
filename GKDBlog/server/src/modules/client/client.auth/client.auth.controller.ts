import {Body, Controller, Get, Headers, Param, Post, Req, Res, UseGuards} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'
import {Response} from 'express'
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'

import {GoogleUserType} from '@common/types'
import {clientIP} from '@secret'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'

import {ClientAuthService} from './client.auth.service'

import * as D from '@common/types/httpDataTypes'

@ApiTags('Client Auth')
@Controller('/client/auth')
export class ClientAuthController {
  constructor(private readonly clientAuthService: ClientAuthService) {}

  // AREA1: 토큰 필요 없는 함수들
  @Post('/logIn')
  @ApiOperation({summary: '로그인', description: '아이디와 비밀번호로 로그인'})
  @ApiBody({
    schema: {
      properties: {
        userId: {type: 'string', example: 'test'},
        password: {type: 'string', example: '12341234!'}
      }
    }
  })
  @ApiResponse({status: 200, description: '로그인 성공'})
  @ApiResponse({status: 400, description: '로그인 실패'})
  async logIn(@Body() data: D.LogInDataType) {
    const {ok, body, errObj, jwtFromServer} = await this.clientAuthService.logIn(data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Post('/signUp')
  @ApiOperation({summary: '회원가입', description: '아이디, 이름, 비밀번호로 회원가입'})
  @ApiBody({
    schema: {
      properties: {
        userId: {type: 'string', example: 'test'},
        userName: {type: 'string', example: '테스트'},
        password: {type: 'string', example: '12341234!'}
      }
    }
  })
  @ApiResponse({status: 200, description: '회원가입 성공'})
  @ApiResponse({status: 400, description: '회원가입 실패'})
  async signUp(@Body() data: D.SignUpDataType) {
    const {ok, body, errObj, jwtFromServer} = await this.clientAuthService.signUp(data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/signUpGoogle')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({summary: '구글 회원가입', description: '구글 회원가입'})
  @ApiResponse({status: 200, description: '구글 회원가입 성공'})
  @ApiResponse({status: 400, description: '구글 회원가입 실패'})
  async signUpGoogle(@Req() req) {
    // Redirecting to google automatically
  }

  @Get('/signUpGoogleCallback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({summary: '구글 회원가입 콜백', description: '구글 회원가입 콜백'})
  @ApiResponse({status: 200, description: '구글 회원가입 콜백 성공'})
  @ApiResponse({status: 400, description: '구글 회원가입 콜백 실패'})
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
  @ApiOperation({summary: '토큰 갱신', description: '토큰 갱신'})
  @ApiResponse({status: 200, description: '토큰 갱신 성공'})
  @ApiResponse({status: 400, description: '토큰 갱신 실패'})
  async refreshToken(@Headers() headers: any) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientAuthService.refreshToken(jwtPayload)

    return {ok, body, errObj, jwtFromServer}
  }
}
