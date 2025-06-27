import {Module} from '@nestjs/common'
import {DatabaseModule} from 'src/modules/database/database.module'
import {SocketGateway} from './socket.gateway'
import {GKDLockModule} from '../gkdLock/gkdLock.module'

import * as S from './services'

@Module({
  imports: [DatabaseModule, GKDLockModule],
  controllers: [],
  providers: [
    S.SocketChatService,
    S.SocketInfoService,
    S.SocketMainService,
    SocketGateway // ::
  ],
  exports: [SocketGateway]
})
export class SocketModule {}
