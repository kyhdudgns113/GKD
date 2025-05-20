import {Body, Controller, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {ClientMembersService} from './client.members.service'
import {SetEMemMatrixDataType} from 'src/common/types'

@Controller('client/members')
export class ClientMembersController {
  constructor(private readonly membersService: ClientMembersService) {}

  // PUT AREA:
  @Put('/saveMatrix')
  @UseGuards(CheckJwtValidationGuard)
  async saveMatrix(@Headers() headers: any, @Body() data: SetEMemMatrixDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.membersService.saveMatrix(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('/getMembers/:commOId')
  @UseGuards(CheckJwtValidationGuard)
  async getMembers(@Headers() headers: any, @Param('commOId') commOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.membersService.getMembers(jwtPayload, commOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/loadData/:commOId')
  @UseGuards(CheckJwtValidationGuard)
  async loadMatrix(@Headers() headers: any, @Param('commOId') commOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.membersService.loadMatrix(jwtPayload, commOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
