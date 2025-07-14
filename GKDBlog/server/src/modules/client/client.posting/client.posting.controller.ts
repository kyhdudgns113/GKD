import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'

import {CheckJwtValidationGuard} from '@common/guards'
import {ClientPostingService} from './client.posting.service'

import * as HTTP from '@common/types/httpDataTypes'

@ApiTags('Client Posting')
@Controller('/client/posting')
export class ClientPostingController {
  constructor(private readonly clientPostingService: ClientPostingService) {}

  // POST AREA:
  @Post('/addDirectory')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '디렉토리 추가', description: '디렉토리 추가'})
  @ApiBody({
    schema: {
      properties: {
        dirName: {type: 'string', example: 'test'},
        parentDirOId: {type: 'string', example: '123456781234567812345678'}
      }
    }
  })
  @ApiResponse({status: 200, description: '디렉토리 추가 성공'})
  @ApiResponse({status: 400, description: '디렉토리 추가 실패'})
  async addDirectory(@Headers() headers: any, @Body() data: HTTP.AddDirectoryDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.addDirectory(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Post('/addFile')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '파일 추가', description: '파일 추가'})
  @ApiBody({
    schema: {
      properties: {
        fileName: {type: 'string', example: 'test'},
        parentDirOId: {type: 'string', example: '123456781234567812345678'}
      }
    }
  })
  @ApiResponse({status: 200, description: '파일 추가 성공'})
  @ApiResponse({status: 400, description: '파일 추가 실패'})
  async addFile(@Headers() headers: any, @Body() data: HTTP.AddFileDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.addFile(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:
  @Put('/moveDirectory')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '디렉토리 이동', description: '디렉토리 이동'})
  @ApiBody({
    schema: {
      properties: {
        moveDirOId: {type: 'string', example: '123456781234567812345678'},
        parentDirOId: {type: 'string', example: '123456781234567812345678'},
        targetIdx: {type: 'number | null', example: 2}
      }
    }
  })
  @ApiResponse({status: 200, description: '디렉토리 이동 성공'})
  @ApiResponse({status: 400, description: '디렉토리 이동 실패'})
  async moveDirectory(@Headers() headers: any, @Body() data: HTTP.MoveDirectoryDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.moveDirectory(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/moveFile')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '파일 이동', description: '파일 이동'})
  @ApiBody({
    schema: {
      properties: {
        moveFileOId: {type: 'string', example: '123456781234567812345678'},
        parentDirOId: {type: 'string', example: '123456781234567812345678'},
        targetIdx: {type: 'number | null', example: 2}
      }
    }
  })
  @ApiResponse({status: 200, description: '파일 이동 성공'})
  @ApiResponse({status: 400, description: '파일 이동 실패'})
  async moveFile(@Headers() headers: any, @Body() data: HTTP.MoveFileDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.moveFile(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/setDirName')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '디렉토리 이름 변경', description: '디렉토리 이름 변경'})
  @ApiBody({
    schema: {
      properties: {
        dirOId: {type: 'string', example: '123456781234567812345678'},
        newDirName: {type: 'string', example: 'test'}
      }
    }
  })
  @ApiResponse({status: 200, description: '디렉토리 이름 변경 성공'})
  @ApiResponse({status: 400, description: '디렉토리 이름 변경 실패'})
  async setDirName(@Headers() headers: any, @Body() data: HTTP.SetDirNameDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.setDirName(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/setFileNameAndContents')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '파일 이름 및 내용 변경', description: '파일 이름 및 내용 변경'})
  @ApiBody({
    schema: {
      properties: {
        contentsArr: {type: 'string[]', example: ['test']},
        fileOId: {type: 'string', example: '123456781234567812345678'},
        name: {type: 'string', example: 'test'}
      }
    }
  })
  @ApiResponse({status: 200, description: '파일 이름 및 내용 변경 성공'})
  @ApiResponse({status: 400, description: '파일 이름 및 내용 변경 실패'})
  async setFileNameAndContents(@Headers() headers: any, @Body() data: HTTP.SetFileNameContentsDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.setFileNameAndContents(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/toggleFilesIsHidden')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '파일 숨김 상태 변경', description: '파일 숨김 상태 변경'})
  @ApiBody({
    schema: {
      properties: {
        fileOId: {type: 'string', example: '123456781234567812345678'},
        prevIsHidden: {type: 'boolean', example: true}
      }
    }
  })
  @ApiResponse({status: 200, description: '파일 숨김 상태 변경 성공'})
  @ApiResponse({status: 400, description: '파일 숨김 상태 변경 실패'})
  async toggleFilesIsHidden(@Headers() headers: any, @Body() data: HTTP.ToggleFilesIsHiddenDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.toggleFilesIsHidden(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/toggleFilesIsIntro')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '파일 공지 상태 변경', description: '파일 공지 상태 변경'})
  @ApiBody({
    schema: {
      properties: {
        fileOId: {type: 'string', example: '123456781234567812345678'},
        prevIsIntroPost: {type: 'boolean', example: true}
      }
    }
  })
  @ApiResponse({status: 200, description: '파일 공지 상태 변경 성공'})
  @ApiResponse({status: 400, description: '파일 공지 상태 변경 실패'})
  async toggleFilesIsIntroPost(@Headers() headers: any, @Body() data: HTTP.ToggleFilesIsIntroDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.toggleFilesIsIntroPost(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('/getDirectoryInfo/:dirOId')
  // @UseGuards(CheckJwtValidationGuard) // Lefter 에서도 호출해야 하므로 jwt 없이 한다.
  @ApiOperation({summary: '디렉토리 정보 조회', description: '디렉토리 정보 조회'})
  @ApiResponse({status: 200, description: '디렉토리 정보 조회 성공'})
  @ApiResponse({status: 400, description: '디렉토리 정보 조회 실패'})
  async getDirectoryInfo(@Param('dirOId') dirOId: string) {
    const {ok, body, errObj} = await this.clientPostingService.getDirectoryInfo(dirOId)
    return {ok, body, errObj}
  }

  @Get(`/getFileInfo/:fileOId`)
  @UseGuards(CheckJwtValidationGuard) // 루트에서는 숨김, 공지 상태 무관하게 불러온다.
  @ApiOperation({summary: '파일 정보 조회', description: '파일 정보 조회'})
  @ApiResponse({status: 200, description: '파일 정보 조회 성공'})
  @ApiResponse({status: 400, description: '파일 정보 조회 실패'})
  async getFileInfo(@Headers() headers: any, @Param('fileOId') fileOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.getFileInfo(jwtPayload, fileOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/getRootDirOId')
  // @UseGuards(CheckJwtValidationGuard) // 로그인 안해도 루트 폴더의 아이디는 가져와야 한다.
  @ApiOperation({summary: '루트 디렉토리 아이디 조회', description: '루트 디렉토리 아이디 조회'})
  @ApiResponse({status: 200, description: '루트 디렉토리 아이디 조회 성공'})
  @ApiResponse({status: 400, description: '루트 디렉토리 아이디 조회 실패'})
  async getRootDirOId() {
    const {ok, body, errObj} = await this.clientPostingService.getRootDirOId()
    return {ok, body, errObj}
  }

  // DELETE AREA:
  @Delete('/deleteDirectory/:dirOId')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '디렉토리 삭제', description: '디렉토리 삭제'})
  @ApiResponse({status: 200, description: '디렉토리 삭제 성공'})
  @ApiResponse({status: 400, description: '디렉토리 삭제 실패'})
  async deleteDirectory(@Headers() headers: any, @Param('dirOId') dirOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.deleteDirectory(jwtPayload, dirOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Delete('/deleteFile/:fileOId')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '파일 삭제', description: '파일 삭제'})
  @ApiResponse({status: 200, description: '파일 삭제 성공'})
  @ApiResponse({status: 400, description: '파일 삭제 실패'})
  async deleteFile(@Headers() headers: any, @Param('fileOId') fileOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientPostingService.deleteFile(jwtPayload, fileOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
