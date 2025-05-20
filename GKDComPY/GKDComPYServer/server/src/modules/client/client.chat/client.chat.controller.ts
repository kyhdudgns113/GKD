import {Controller, Get, Headers, Param, UseGuards} from '@nestjs/common'
import {ClientChatService} from './client.chat.service'
import {CheckJwtValidationGuard} from 'src/common/guards'

@Controller('client/chat')
export class ClientChatController {
  constructor(private readonly chatService: ClientChatService) {}

  @Get(`/getChatsArr/:clubOId/:firstIdx`)
  @UseGuards(CheckJwtValidationGuard)
  async getChatsArr(
    @Headers() headers: any,
    @Param('clubOId') clubOId: string,
    @Param('firstIdx') firstIdx: number
  ) {
    /**
     * 채팅방이 없으면 생성하도록 해야한다 \
     * 채팅방이 없는 경우도 고려해야 하므로 clubOId 를 받는다.
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.chatService.getChatsArr(jwtPayload, clubOId, firstIdx)
    return {ok, body, errObj, jwtFromServer}
  }
}
