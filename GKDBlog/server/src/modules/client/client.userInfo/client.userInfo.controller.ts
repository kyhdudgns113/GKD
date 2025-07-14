import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientUserInfoService} from './client.userInfo.service'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'

@ApiTags('Client UserInfo')
@Controller('client/userInfo')
export class ClientUserInfoController {
  constructor(private readonly clientService: ClientUserInfoService) {}

  // PUT AREA:
  @Put('/openUserChatRoom/:targetUserOId')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '유저 채팅방 열기', description: '유저 채팅방 열기'})
  @ApiResponse({status: 200, description: '유저 채팅방 열기 성공'})
  @ApiResponse({status: 400, description: '유저 채팅방 열기 실패'})
  async openUserChatRoom(@Headers() headers: any, @Param('targetUserOId') targetUserOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.openUserChatRoom(jwtPayload, targetUserOId)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('/getChatArr/:chatRoomOId/:firstIndex')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '채팅 목록 조회', description: '채팅 목록 조회'})
  @ApiResponse({status: 200, description: '채팅 목록 조회 성공'})
  @ApiResponse({status: 400, description: '채팅 목록 조회 실패'})
  async getChatArr(@Headers() headers: any, @Param('chatRoomOId') chatRoomOId: string, @Param('firstIndex') firstIndex: number) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getChatArr(jwtPayload, chatRoomOId, firstIndex)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/getChatRoom/:chatRoomOId')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '채팅방 조회', description: '채팅방 조회'})
  @ApiResponse({status: 200, description: '채팅방 조회 성공'})
  @ApiResponse({status: 400, description: '채팅방 조회 실패'})
  async getChatRoom(@Headers() headers: any, @Param('chatRoomOId') chatRoomOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getChatRoom(jwtPayload, chatRoomOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/getChatRoomRow/:userOId/:chatRoomOId')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '채팅방 행 조회', description: '채팅방 행 조회'})
  @ApiResponse({status: 200, description: '채팅방 행 조회 성공'})
  @ApiResponse({status: 400, description: '채팅방 행 조회 실패'})
  async getChatRoomRow(@Headers() headers: any, @Param('userOId') userOId: string, @Param('chatRoomOId') chatRoomOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getChatRoomRow(jwtPayload, userOId, chatRoomOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/getChatRoomRowArr/:userOId')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '채팅방 행 목록 조회', description: '채팅방 행 목록 조회'})
  @ApiResponse({status: 200, description: '채팅방 행 목록 조회 성공'})
  @ApiResponse({status: 400, description: '채팅방 행 목록 조회 실패'})
  async getChatRoomRowArr(@Headers() headers: any, @Param('userOId') userOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getChatRoomRowArr(jwtPayload, userOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/getNewAlarmArrLen/:userOId')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '새 알림 목록 길이 조회', description: '새 알림 목록 길이 조회'})
  @ApiResponse({status: 200, description: '새 알림 목록 길이 조회 성공'})
  @ApiResponse({status: 400, description: '새 알림 목록 길이 조회 실패'})
  async getNewAlarmArrLen(@Headers() headers: any, @Param('userOId') userOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getNewAlarmArrLen(jwtPayload, userOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get(`/refreshAlarmArr/:userOId`)
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '알림 목록 새로고침', description: '알림 목록 새로고침'})
  @ApiResponse({status: 200, description: '알림 목록 새로고침 성공'})
  @ApiResponse({status: 400, description: '알림 목록 새로고침 실패'})
  async refreshAlarmArr(@Headers() headers: any, @Param('userOId') userOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.refreshAlarmArr(jwtPayload, userOId)
    return {ok, body, errObj, jwtFromServer}
  }

  // DELETE AREA:

  @Delete(`/deleteAlarm/:alarmOId`)
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '알림 삭제', description: '알림 삭제'})
  @ApiResponse({status: 200, description: '알림 삭제 성공'})
  @ApiResponse({status: 400, description: '알림 삭제 실패'})
  async deleteAlarm(@Headers() headers: any, @Param('alarmOId') alarmOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.deleteAlarm(jwtPayload, alarmOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
