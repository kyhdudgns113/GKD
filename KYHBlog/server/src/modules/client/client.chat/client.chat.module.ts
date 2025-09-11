import {Module} from '@nestjs/common'
import {ClientChatController} from './client.chat.controller'
import {ClientChatService} from './client.chat.service'
import {DatabaseModule} from '@module/database'
import {GKDJwtModule} from '@module/gkdJwt'
import {CheckJwtValidationGuard} from '@common/guards'
import {SocketModule} from '@module/socket'

@Module({
  imports: [DatabaseModule, GKDJwtModule, SocketModule],
  controllers: [ClientChatController],
  providers: [CheckJwtValidationGuard, ClientChatService],
  exports: [ClientChatService]
})
export class ClientChatModule {}
