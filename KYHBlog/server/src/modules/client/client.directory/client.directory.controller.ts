import {Body, Controller, Get, Headers, Param, Post, UseGuards} from '@nestjs/common'
import {ClientDirectoryService} from './client.directory.service'
import {CheckAdminGuard} from '@common/guards'
import {AddDirectoryType} from '@common/types'

import * as HTTP from '@httpDataTypes'

@Controller('/client/directory')
export class ClientDirectoryController {
  constructor(private readonly clientService: ClientDirectoryService) {}

  // POST AREA:

  @Post('/addDirectory')
  @UseGuards(CheckAdminGuard)
  async addDirectory(@Headers() headers: any, @Body() data: HTTP.AddDirectoryType) {
    /**
     * 입력
     *   - parentDirOId
     *   - dirName
     *
     * 기능
     *   - parentDirOId 디렉토리에 dirName 디렉토리 추가
     *
     * 출력
     *   - extraDirs
     *     - parentDirOId 디렉토리, dirName 디렉토리 순으로 들어간다.
     *   - extraFileRows
     *     - parentDirOId 디렉토리의 파일행만 들어간다
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.addDirectory(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Post('/addFile')
  @UseGuards(CheckAdminGuard)
  async addFile(@Headers() headers: any, @Body() data: HTTP.AddFileType) {
    /**
     * 입력
     *   - dirOId
     *   - fileName
     *
     * 기능
     *   - dirOId 디렉토리에 fileName 파일 추가
     *
     * 출력
     *   - extraDirs
     *     - dirOId 디렉토리
     *   - extraFileRows
     *     - dirOId 디렉토리의 파일행
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.addFile(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // GET AREA:

  @Get('/loadRootDirectory')
  async loadRootDirectory() {
    /**
     * 기능
     *   - 루트 디렉토리 불러오기
     *
     * 출력
     *   - extraDirs
     *     - 루트 디렉토리, 자식디렉토리 순서대로 들어간다.
     *   - extraFileRows
     *     - 루트 디렉토리, 자식 디렉토리들의 파일행이 순서대로 들어간다.
     */
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadRootDirectory()
    return {ok, body, gkdErrMsg, statusCode}
  }
}
