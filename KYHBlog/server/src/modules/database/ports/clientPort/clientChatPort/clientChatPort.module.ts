import {Module} from '@nestjs/common'
import {ClientChatPortService} from './clientChatPort.service'

import {DBHubModule} from '../../../dbHub'
import {GKDLockModule, GKDLockService} from '@module/gkdLock'

@Module({
  imports: [DBHubModule, GKDLockModule],
  controllers: [],
  providers: [ClientChatPortService, GKDLockService],
  exports: [ClientChatPortService]
})
export class ClientChatPortModule {}
