import {Body, Controller, Get, Headers, Param, Put, UseGuards} from '@nestjs/common'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {ClientDocService} from './client.doc.service'
import {SetDocumentDataType} from 'src/common/types'

@Controller('client/doc')
export class ClientDocController {
  constructor(private readonly docService: ClientDocService) {}

  @Put(`/setDocument`)
  @UseGuards(CheckJwtValidationGuard)
  async setDocument(@Headers() headers: any, @Body() data: SetDocumentDataType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.docService.setDocument(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get(`/getDocument/:clubOId`)
  @UseGuards(CheckJwtValidationGuard)
  async getDocument(@Headers() headers: any, @Param('clubOId') clubOId: string) {
    /**
     * 문서가 없으면 생성하도록 해야한다 \
     * 문서가 없는 경우도 고려해야 하므로 clubOId 를 받는다.
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.docService.getDocument(jwtPayload, clubOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
