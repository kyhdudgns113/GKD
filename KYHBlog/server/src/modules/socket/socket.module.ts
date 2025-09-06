import {Module} from '@nestjs/common'
import {DatabaseModule} from '@module/database'
import {SocketGateway} from './socket.gateway'
import {SocketInfoService, SocketUserService} from './services'
import {SocketService} from './socket.service'
import {CheckSocketJwtGuard} from '@common/guards'
import {GKDJwtModule} from '@module/gkdJwt'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [],
  providers: [
    CheckSocketJwtGuard,
    SocketGateway, // ::
    SocketInfoService,
    SocketUserService,
    SocketService
  ],
  exports: [SocketGateway, SocketInfoService, SocketUserService, SocketService]
})
export class SocketModule {}
