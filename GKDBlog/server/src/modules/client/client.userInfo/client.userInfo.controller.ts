import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientUserInfoService} from './client.userInfo.service'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'
import * as HTTP from '@common/types/httpDataTypes'

@Controller('client/userInfo')
export class ClientUserInfoController {
  constructor(private readonly clientService: ClientUserInfoService) {}

  // PUT AREA:
  @Put('/openUserChatRoom/:targetUserOId')
  @UseGuards(CheckJwtValidationGuard)
  async openUserChatRoom(@Headers() headers: any, @Param('targetUserOId') targetUserOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.openUserChatRoom(jwtPayload, targetUserOId)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('/getChatArr/:chatRoomOId/:firstIndex')
  @UseGuards(CheckJwtValidationGuard)
  async getChatArr(@Headers() headers: any, @Param('chatRoomOId') chatRoomOId: string, @Param('firstIndex') firstIndex: number) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getChatArr(jwtPayload, chatRoomOId, firstIndex)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/getChatRoom/:chatRoomOId')
  @UseGuards(CheckJwtValidationGuard)
  async getChatRoom(@Headers() headers: any, @Param('chatRoomOId') chatRoomOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getChatRoom(jwtPayload, chatRoomOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/getChatRoomRow/:userOId/:chatRoomOId')
  @UseGuards(CheckJwtValidationGuard)
  async getChatRoomRow(@Headers() headers: any, @Param('userOId') userOId: string, @Param('chatRoomOId') chatRoomOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getChatRoomRow(jwtPayload, userOId, chatRoomOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/getChatRoomRowArr/:userOId')
  @UseGuards(CheckJwtValidationGuard)
  async getChatRoomRowArr(@Headers() headers: any, @Param('userOId') userOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getChatRoomRowArr(jwtPayload, userOId)
    return {ok, body, errObj, jwtFromServer}
  }

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
