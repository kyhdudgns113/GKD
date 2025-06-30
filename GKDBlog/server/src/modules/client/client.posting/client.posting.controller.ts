import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'

import {CheckJwtValidationGuard} from '@common/guards'
import {ClientPostingService} from './client.posting.service'

import * as HTTP from '@common/types/httpDataTypes'

@Controller('/client/posting')
export class ClientPostingController {
  constructor(private readonly clientPostingService: ClientPostingService) {}

  // POST AREA:
  @Post('/addDirectory')
  @UseGuards(CheckJwtValidationGuard)
  async addDirectory(@Headers() headers: any, @Body() data: HTTP.AddDirectoryDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.addDirectory(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Post('/addFile')
  @UseGuards(CheckJwtValidationGuard)
  async addFile(@Headers() headers: any, @Body() data: HTTP.AddFileDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.addFile(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:
  @Put('/moveDirectory')
  @UseGuards(CheckJwtValidationGuard)
  async moveDirectory(@Headers() headers: any, @Body() data: HTTP.MoveDirectoryDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.moveDirectory(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/moveFile')
  @UseGuards(CheckJwtValidationGuard)
  async moveFile(@Headers() headers: any, @Body() data: HTTP.MoveFileDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.moveFile(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/setDirName')
  @UseGuards(CheckJwtValidationGuard)
  async setDirName(@Headers() headers: any, @Body() data: HTTP.SetDirNameDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.setDirName(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/setFileNameAndContents')
  @UseGuards(CheckJwtValidationGuard)
  async setFileNameAndContents(@Headers() headers: any, @Body() data: HTTP.SetFileNameContentsDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.setFileNameAndContents(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/toggleFilesIsIntro')
  @UseGuards(CheckJwtValidationGuard)
  async toggleFilesIsIntroPost(@Headers() headers: any, @Body() data: HTTP.ToggleFilesIsIntroDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.toggleFilesIsIntroPost(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('/getDirectoryInfo/:dirOId')
  // @UseGuards(CheckJwtValidationGuard) // 아 이것도 jwt 필요없다.
  async getDirectoryInfo(@Param('dirOId') dirOId: string) {
    const {ok, body, errObj} = await this.clientPostingService.getDirectoryInfo(dirOId)
    return {ok, body, errObj}
  }

  @Get(`/getFileInfo/:fileOId`)
  // @UseGuards(CheckJwtValidationGuard) // 아 이건 jwt 필요없지...
  async getFileInfo(@Param('fileOId') fileOId: string) {
    const {ok, body, errObj} = await this.clientPostingService.getFileInfo(fileOId)
    return {ok, body, errObj}
  }

  @Get('/getRootDirOId')
  // @UseGuards(CheckJwtValidationGuard) // 아 이건 jwt 필요없지...
  async getRootDirOId() {
    const {ok, body, errObj} = await this.clientPostingService.getRootDirOId()
    return {ok, body, errObj}
  }

  // DELETE AREA:
  @Delete('/deleteDirectory/:dirOId')
  @UseGuards(CheckJwtValidationGuard)
  async deleteDirectory(@Headers() headers: any, @Param('dirOId') dirOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.deleteDirectory(jwtPayload, dirOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Delete('/deleteFile/:fileOId')
  @UseGuards(CheckJwtValidationGuard)
  async deleteFile(@Headers() headers: any, @Param('fileOId') fileOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.deleteFile(jwtPayload, fileOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
