import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientFileService} from './client.file.service'
import {CheckAdminGuard, CheckJwtValidationGuard} from '@common/guards'
import {AddCommentType, AddReplyType, EditCommentType, EditFileType, EditReplyType} from '@common/types'

@Controller('/client/file')
export class ClientFileController {
  constructor(private readonly clientService: ClientFileService) {}

  // POST AREA:

  @Post('/addComment')
  @UseGuards(CheckJwtValidationGuard)
  async addComment(@Headers() headers: any, @Body() data: AddCommentType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.addComment(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Post('/addReply')
  @UseGuards(CheckJwtValidationGuard)
  async addReply(@Headers() headers: any, @Body() data: AddReplyType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.addReply(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // PUT AREA:

  @Put('/editComment')
  @UseGuards(CheckJwtValidationGuard)
  async editComment(@Headers() headers: any, @Body() data: EditCommentType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.editComment(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Put('/editFile')
  @UseGuards(CheckAdminGuard)
  async editFile(@Headers() headers: any, @Body() data: EditFileType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.editFile(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Put('/editReply')
  @UseGuards(CheckJwtValidationGuard)
  async editReply(@Headers() headers: any, @Body() data: EditReplyType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.editReply(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // GET AREA:

  @Get('/loadComments/:fileOId')
  async loadComments(@Param('fileOId') fileOId: string) {
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadComments(fileOId)
    return {ok, body, gkdErrMsg, statusCode}
  }

  @Get('/loadFile/:fileOId')
  async loadFile(@Param('fileOId') fileOId: string) {
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadFile(fileOId)
    return {ok, body, gkdErrMsg, statusCode}
  }

  // DELETE AREA:

  @Delete('/deleteComment/:commentOId')
  @UseGuards(CheckJwtValidationGuard)
  async deleteComment(@Headers() headers: any, @Param('commentOId') commentOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.deleteComment(jwtPayload, commentOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Delete('/deleteReply/:replyOId')
  @UseGuards(CheckJwtValidationGuard)
  async deleteReply(@Headers() headers: any, @Param('replyOId') replyOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.deleteReply(jwtPayload, replyOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }
}
