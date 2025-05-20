import {Module} from '@nestjs/common'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {SocketChatService} from './socket.chat'
import {SocketInfoService} from './socket.info'
import {SocketGateway} from './socket.gateway'
import {GKDLockModule} from '../gkdLock/gkdLock.module'

@Module({
  imports: [DatabaseModule, GKDJwtModule, GKDLockModule],
  controllers: [],
  providers: [SocketChatService, SocketInfoService, SocketGateway, CheckJwtValidationGuard],
  exports: [SocketChatService]
})
export class SocketModule {}
