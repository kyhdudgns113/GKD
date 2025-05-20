import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientClubService} from './client.club.service'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {
  AddMemberDataType,
  ChangeMemClubDataType,
  SetCardInfoDataType,
  SetMemberCommentDataType,
  SetMemberPosDataType,
  SetMemberPowerDataType
} from 'src/common/types'

@Controller('client/club')
export class ClientClubController {
  constructor(private readonly clubService: ClientClubService) {}

  // POST AREA:
  @Post(`/addMemberReq`)
  @UseGuards(CheckJwtValidationGuard)
  async addMemberReq(@Headers() headers: any, @Body() data: AddMemberDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clubService.addMemberReq(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // PUT AREA:
  @Put(`/member/changeClub`)
  @UseGuards(CheckJwtValidationGuard)
  async changeMemClub(@Headers() headers: any, @Body() data: ChangeMemClubDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clubService.changeMemClub(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Put(`/member/setCardInfo`)
  @UseGuards(CheckJwtValidationGuard)
  async setCardInfo(@Headers() headers: any, @Body() data: SetCardInfoDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clubService.setCardInfo(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put('/setMemComment')
  @UseGuards(CheckJwtValidationGuard)
  async setMemComment(@Headers() headers: any, @Body() data: SetMemberCommentDataType) {
    /**
     * 클럽 멤버 리스트에서의 멤버 코멘트를 변경한다.
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clubService.setMemComment(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put(`/setMemPos`)
  @UseGuards(CheckJwtValidationGuard)
  async setMemPos(@Headers() headers: any, @Body() data: SetMemberPosDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clubService.setMemPos(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Put(`/member/setMemPower`)
  @UseGuards(CheckJwtValidationGuard)
  async setMemPower(@Headers() headers: any, @Body() data: SetMemberPowerDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clubService.setMemPower(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('getMemberRecordsArr/:memOId/:dateRange')
  @UseGuards(CheckJwtValidationGuard)
  async getMemberRecordsArr(
    @Headers() headers: any,
    @Param('memOId') memOId: string,
    @Param('dateRange') dateRange: number
  ) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clubService.getMemberRecordsArr(
      jwtPayload,
      memOId,
      dateRange
    )
    return {ok, body, errObj, jwtFromServer}
  }
  @Get(`/getMembers/:clubOId`)
  @UseGuards(CheckJwtValidationGuard)
  async getMembers(@Headers() headers: any, @Param('clubOId') clubOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clubService.getMembers(jwtPayload, clubOId)
    return {ok, body, errObj, jwtFromServer}
  }

  // DELETE AREA:
  @Delete(`/deleteMem/:clubOId/:memOId`)
  @UseGuards(CheckJwtValidationGuard)
  async deleteMem(
    @Headers() headers: any,
    @Param('clubOId') clubOId: string,
    @Param('memOId') memOId: string
  ) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clubService.deleteClubMember(jwtPayload, clubOId, memOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
