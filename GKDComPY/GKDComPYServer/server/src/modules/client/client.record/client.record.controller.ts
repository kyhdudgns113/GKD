import {Body, Controller, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {ClientRecordService} from './client.record.service'
import {
  AddNextWeekDataType,
  AddPrevWeekDataType,
  AddRowMemberDataType,
  DeleteRowMemDataType,
  DeleteWeekRowDataType,
  SetCommentDataType,
  SetDailyRecordType,
  SetRowMemberDataType,
  SetTHeadDataType,
  SetWeeklyCommentDataType
} from 'src/common/types'

@Controller('client/record')
export class ClientRecordController {
  constructor(private readonly recordService: ClientRecordService) {}

  // POST AREA:
  @Post(`/addNextWeek`)
  @UseGuards(CheckJwtValidationGuard)
  async addNextWeek(@Headers() headers: any, @Body() data: AddNextWeekDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.addNextWeek(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post('/addPrevWeek')
  @UseGuards(CheckJwtValidationGuard)
  async addPrevWeek(@Headers() headers: any, @Body() data: AddPrevWeekDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.addPrevWeek(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post(`/addRowMember`)
  @UseGuards(CheckJwtValidationGuard)
  async addRowMember(@Headers() headers: any, @Body() data: AddRowMemberDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.addRowMember(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post(`/setTHead`)
  @UseGuards(CheckJwtValidationGuard)
  async setTHead(@Headers() headers: any, @Body() data: SetTHeadDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.setTHead(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post(`/submitRecord`)
  @UseGuards(CheckJwtValidationGuard)
  async submitRecord(@Headers() headers: any, @Body() data: SetDailyRecordType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.submitRecord(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:
  @Put(`/deleteRowMem`)
  @UseGuards(CheckJwtValidationGuard)
  async deleteRowMem(@Headers() headers: any, @Body() data: DeleteRowMemDataType) {
    /**
     * DELETE 쓰기위해 url 에 name 넣으면 한글 인코딩 오류난다 ㅠㅠ
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.deleteRowMember(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put(`/deleteWeekRow`)
  @UseGuards(CheckJwtValidationGuard)
  async deleteWeekRow(@Headers() headers: any, @Body() data: DeleteWeekRowDataType) {
    /**
     * URL 에 이상한 인덱스 넣어서 보내는거 방지하기 위해 PUT 으로 한 것 같다.
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.deleteWeekRow(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put(`/setComments`)
  @UseGuards(CheckJwtValidationGuard)
  async setComments(@Headers() headers: any, @Body() data: SetCommentDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.setComments(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put('/setRowMember')
  @UseGuards(CheckJwtValidationGuard)
  async setRowMember(@Headers() headers: any, @Body() data: SetRowMemberDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.setRowMember(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put('/setWeekComment')
  @UseGuards(CheckJwtValidationGuard)
  async setWeeklyComment(@Headers() headers: any, @Body() data: SetWeeklyCommentDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.setWeeklyComment(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get(`/getWeekRowsArr/:clubOId`)
  @UseGuards(CheckJwtValidationGuard)
  async getWeekRowsArr(@Headers() headers: any, @Param('clubOId') clubOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.getWeekRowsArr(jwtPayload, clubOId)
    return {ok, body, errObj, jwtFromServer}
  }
  @Get(`/getWeeklyRecord/:weekOId`)
  @UseGuards(CheckJwtValidationGuard)
  async getWeeklyRecord(@Headers() headers: any, @Param('weekOId') weekOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.recordService.getWeeklyRecord(jwtPayload, weekOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
