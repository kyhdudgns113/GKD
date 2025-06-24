import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientUserInfoService} from './client.userInfo.service'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'
import * as HTTP from '@common/types/httpDataTypes'

@Controller('client/userInfo')
export class ClientUserInfoController {
  constructor(private readonly clientService: ClientUserInfoService) {}

  // GET AREA:

  @Get('/getNewAlarmArrLen/:userOId')
  @UseGuards(CheckJwtValidationGuard)
  async getNewAlarmArrLen(@Headers() headers: any, @Param('userOId') userOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getNewAlarmArrLen(jwtPayload, userOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get(`/refreshAlarmArr/:userOId`)
  @UseGuards(CheckJwtValidationGuard)
  async refreshAlarmArr(@Headers() headers: any, @Param('userOId') userOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.refreshAlarmArr(jwtPayload, userOId)
    return {ok, body, errObj, jwtFromServer}
  }

  // DELETE AREA:

  @Delete(`/deleteAlarm/:alarmOId`)
  @UseGuards(CheckJwtValidationGuard)
  async deleteAlarm(@Headers() headers: any, @Param('alarmOId') alarmOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.deleteAlarm(jwtPayload, alarmOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
