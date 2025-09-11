import {Module} from '@nestjs/common'
import {DatabaseModule} from '@module/database'
import {SocketGateway} from './socket.gateway'
import {SocketInfoService, SocketUserService, SocketChatService} from './services'
import {SocketService} from './socket.service'
import {CheckSocketJwtGuard} from '@common/guards'
import {GKDJwtModule} from '@module/gkdJwt'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [],
  providers: [
    CheckSocketJwtGuard,
    SocketGateway, // ::
    SocketChatService,
    SocketInfoService,
    SocketUserService,
    SocketService
  ],
  exports: [SocketGateway, SocketInfoService, SocketUserService, SocketService, SocketChatService]
})
export class SocketModule {}
