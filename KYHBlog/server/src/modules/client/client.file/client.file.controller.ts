import {Body, Controller, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientFileService} from './client.file.service'
import {CheckAdminGuard, CheckJwtValidationGuard} from '@common/guards'
import {AddCommentType, EditFileType} from '@common/types'

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

  // PUT AREA:

  @Put('/editFile')
  @UseGuards(CheckAdminGuard)
  async editFile(@Headers() headers: any, @Body() data: EditFileType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.editFile(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // GET AREA:

  @Get('/loadComments/:fileOId/:pageIdx')
  async loadComments(@Param('fileOId') fileOId: string, @Param('pageIdx') pageIdx: number) {
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadComments(fileOId, pageIdx)
    return {ok, body, gkdErrMsg, statusCode}
  }

  @Get('/loadFile/:fileOId')
  async loadFile(@Param('fileOId') fileOId: string) {
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadFile(fileOId)
    return {ok, body, gkdErrMsg, statusCode}
  }
}
