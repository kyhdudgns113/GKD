import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientReadingService} from './client.reading.service'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'
import * as HTTP from '@common/types/httpDataTypes'

@Controller('client/reading')
export class ClientReadingController {
  constructor(private readonly clientService: ClientReadingService) {}

  // POST AREA:
  @Post('/addComment')
  @UseGuards(CheckJwtValidationGuard)
  async addComment(@Headers() headers: any, @Body() data: HTTP.AddCommentDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.addComment(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Post('/addReply')
  @UseGuards(CheckJwtValidationGuard)
  async addReply(@Headers() headers: any, @Body() data: HTTP.AddReplyDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.addReply(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:

  @Put('/deleteReply')
  @UseGuards(CheckJwtValidationGuard)
  async deleteReply(@Headers() headers: any, @Body() data: HTTP.DeleteReplyDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.deleteReply(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put(`/modifyComment`)
  @UseGuards(CheckJwtValidationGuard)
  async modifyComment(@Headers() headers: any, @Body() data: HTTP.ModifyCommentDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.modifyComment(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/modifyReply')
  @UseGuards(CheckJwtValidationGuard)
  async modifyReply(@Headers() headers: any, @Body() data: HTTP.ModifyReplyDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.modifyReply(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  //  GET AREA:
  @Get('/readCommentsArr/:fileOId')
  // @UseGuards(CheckJwtValidationGuard) // 회원 아니어도 읽을 수 있게 할까...?
  async readCommentsArr(@Param('fileOId') fileOId: string) {
    const {ok, body, errObj} = await this.clientService.readCommentsArr(fileOId)
    return {ok, body, errObj}
  }

  @Get('/readFile/:fileOId')
  // @UseGuards(CheckJwtValidationGuard) // 회원 아니어도 읽을 수 있게 할까...?
  async readFile(@Param('fileOId') fileOId: string) {
    const {ok, body, errObj} = await this.clientService.readFile(fileOId)
    return {ok, body, errObj}
  }

  // DELETE AREA:
  @Delete('/deleteComment/:commentOId')
  @UseGuards(CheckJwtValidationGuard)
  async deleteComment(@Headers() headers: any, @Param('commentOId') commentOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.deleteComment(jwtPayload, commentOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
