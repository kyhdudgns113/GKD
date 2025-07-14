import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientReadingService} from './client.reading.service'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'

import * as HTTP from '@common/types/httpDataTypes'

@ApiTags('Client Reading')
@Controller('client/reading')
export class ClientReadingController {
  constructor(private readonly clientService: ClientReadingService) {}

  // POST AREA:
  @Post('/addComment')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '댓글 추가', description: '댓글 추가'})
  @ApiBody({
    schema: {
      properties: {
        content: {type: 'string', example: 'test'},
        fileOId: {type: 'string', example: '123456781234567812345678'},
        userOId: {type: 'string', example: '123456781234567812345678'}
      }
    }
  })
  @ApiResponse({status: 200, description: '댓글 추가 성공'})
  @ApiResponse({status: 400, description: '댓글 추가 실패'})
  async addComment(@Headers() headers: any, @Body() data: HTTP.AddCommentDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.addComment(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Post('/addReply')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '대댓글 추가', description: '대댓글 추가'})
  @ApiBody({
    schema: {
      properties: {
        commentOId: {type: 'string', example: '123456781234567812345678'},
        content: {type: 'string', example: 'test'},
        fileOId: {type: 'string', example: '123456781234567812345678'},
        userOId: {type: 'string', example: '123456781234567812345678'}
      }
    }
  })
  @ApiResponse({status: 200, description: '대댓글 추가 성공'})
  async addReply(@Headers() headers: any, @Body() data: HTTP.AddReplyDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.addReply(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:

  @Put('/deleteReply')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '대댓글 삭제', description: '대댓글 삭제'})
  @ApiBody({
    schema: {
      properties: {
        commentOId: {type: 'string', example: '123456781234567812345678'},
        dateString: {type: 'string', example: '2025-01-01'},
        userOId: {type: 'string', example: '123456781234567812345678'}
      }
    }
  })
  @ApiResponse({status: 200, description: '대댓글 삭제 성공'})
  @ApiResponse({status: 400, description: '대댓글 삭제 실패'})
  async deleteReply(@Headers() headers: any, @Body() data: HTTP.DeleteReplyDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.deleteReply(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put(`/modifyComment`)
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '댓글 수정', description: '댓글 수정'})
  @ApiBody({
    schema: {
      properties: {
        commentOId: {type: 'string', example: '123456781234567812345678'},
        content: {type: 'string', example: 'test'}
      }
    }
  })
  @ApiResponse({status: 200, description: '댓글 수정 성공'})
  @ApiResponse({status: 400, description: '댓글 수정 실패'})
  async modifyComment(@Headers() headers: any, @Body() data: HTTP.ModifyCommentDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.modifyComment(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put('/modifyReply')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '대댓글 수정', description: '대댓글 수정'})
  @ApiBody({
    schema: {
      properties: {
        commentOId: {type: 'string', example: '123456781234567812345678'},
        content: {type: 'string', example: 'test'},
        dateString: {type: 'string', example: '2025-01-01'},
        userOId: {type: 'string', example: '123456781234567812345678'}
      }
    }
  })
  @ApiResponse({status: 200, description: '대댓글 수정 성공'})
  @ApiResponse({status: 400, description: '대댓글 수정 실패'})
  async modifyReply(@Headers() headers: any, @Body() data: HTTP.ModifyReplyDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.modifyReply(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  //  GET AREA:
  @Get('/readCommentsArr/:fileOId')
  // @UseGuards(CheckJwtValidationGuard) // 회원 아니어도 읽을 수 있게 할까...?
  @ApiOperation({summary: '댓글 목록 조회', description: '댓글 목록 조회'})
  @ApiResponse({status: 200, description: '댓글 목록 조회 성공'})
  @ApiResponse({status: 400, description: '댓글 목록 조회 실패'})
  async readCommentsArr(@Param('fileOId') fileOId: string) {
    const {ok, body, errObj} = await this.clientService.readCommentsArr(fileOId)
    return {ok, body, errObj}
  }

  @Get('/readFile/:fileOId')
  // @UseGuards(CheckJwtValidationGuard) // 회원 아니어도 읽을 수 있게 할까...??
  @ApiOperation({summary: '파일 조회', description: '파일 조회'})
  @ApiResponse({status: 200, description: '파일 조회 성공'})
  @ApiResponse({status: 400, description: '파일 조회 실패'})
  async readFile(@Param('fileOId') fileOId: string) {
    /**
     * 파일이 숨겨졌거나 공지로 등록되어있으면 errObj.isHidden 이 true 이다.
     */
    const {ok, body, errObj} = await this.clientService.readFile(fileOId)

    return {ok, body, errObj}
  }

  @Get('/readFileHidden/:fileOId')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '숨김 파일 조회', description: '숨김 파일 조회'})
  @ApiResponse({status: 200, description: '숨김 파일 조회 성공'})
  @ApiResponse({status: 400, description: '숨김 파일 조회 실패'})
  async readFileHidden(@Headers() headers: any, @Param('fileOId') fileOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.readFileHidden(jwtPayload, fileOId)
    return {ok, body, errObj, jwtFromServer}
  }

  // DELETE AREA:
  @Delete('/deleteComment/:commentOId')
  @UseGuards(CheckJwtValidationGuard)
  @ApiOperation({summary: '댓글 삭제', description: '댓글 삭제'})
  @ApiResponse({status: 200, description: '댓글 삭제 성공'})
  @ApiResponse({status: 400, description: '댓글 삭제 실패'})
  async deleteComment(@Headers() headers: any, @Param('commentOId') commentOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.deleteComment(jwtPayload, commentOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
