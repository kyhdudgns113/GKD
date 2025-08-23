import {Body, Controller, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
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

  // PUT AREA:

  @Put('/moveDirectory')
  @UseGuards(CheckAdminGuard)
  async moveDirectory(@Headers() headers: any, @Body() data: HTTP.MoveDirectoryType) {
    /**
     * 입력
     *   - moveDirOId: 이동할 폴더의 OId(로깅용용)
     *   - oldParentDirOId: 기존 부모 폴더의 OId
     *   - oldParentChildArr: 기존 부모 폴더의 자식 디렉토리 OId 배열
     *   - newParentDirOId: 새로운 부모 폴더의 OId
     *   - newParentChildArr: 새로운 부모 폴더의 자식 디렉토리 OId 배열
     *
     * 기능
     *   - moveDirOId 폴더가 이동하는 상황이다.
     *   - oldParentDirOId 와 newParentDirOId 폴더의 자식폴더 배열을 바꾼다.
     *
     * 출력
     *   - extraDirs
     *     - 기존 부모폴더, 새로운 부모폴더 순서대로 DirectoryType 정보가 들어간다
     *   - extraFileRows
     *     - 기존 부모폴더, 새로운 부모폴더 순서대로 FileRowsType 정보가 들어온다.
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.moveDirectory(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Put('/moveFile')
  @UseGuards(CheckAdminGuard)
  async moveFile(@Headers() headers: any, @Body() data: HTTP.MoveFileType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.moveFile(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // GET AREA:

  @Get('/loadDirectory/:dirOId')
  async loadDirectory(@Param('dirOId') dirOId: string) {
    /**
     * 입력
     *   - dirOId: 읽어올 디렉토리의 OId
     *
     * 기능
     *   - dirOId 디렉토리와 그 자식파일행의 정보를 읽어온다.
     *
     * 출력
     *   - extraDirs
     *     - dirOId 디렉토리만 들어간다
     *   - extraFileRows
     *     - dirOId 디렉토리의 파일행만 들어간다.
     */
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadDirectory(dirOId)
    return {ok, body, gkdErrMsg, statusCode}
  }

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
