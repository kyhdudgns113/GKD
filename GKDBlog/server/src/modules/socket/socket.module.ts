import {Module} from '@nestjs/common'
import {DatabaseModule} from 'src/modules/database/database.module'
import {SocketGateway} from './socket.gateway'
import {GKDLockModule} from '../gkdLock/gkdLock.module'

import * as S from './services'

@Module({
  imports: [DatabaseModule, GKDLockModule],
  controllers: [],
  providers: [S.SocketInfoService, SocketGateway, S.SocketMainService],
  exports: [SocketGateway]
})
export class SocketModule {}
