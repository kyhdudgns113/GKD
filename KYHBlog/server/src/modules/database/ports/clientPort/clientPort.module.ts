import {Module} from '@nestjs/common'
import {ClientAuthPortModule, ClientAuthPortService} from './clientAuthPort'
import {ClientChatPortModule, ClientChatPortService} from './clientChatPort'
import {ClientDirPortModule, ClientDirPortService} from './clientDirPort'
import {ClientFilePortModule, ClientFilePortService} from './clientFilePort'
import {ClientUserPortModule, ClientUserPortService} from './clientUserPort'
import {DBHubModule} from '../../dbHub'
import {GKDLockService} from '@module/gkdLock'

@Module({
  imports: [
    ClientAuthPortModule, // ::
    ClientChatPortModule,
    ClientDirPortModule,
    ClientFilePortModule,
    ClientUserPortModule,
    DBHubModule
  ],
  controllers: [],
  providers: [
    ClientAuthPortService, // ::
    ClientChatPortService,
    ClientDirPortService,
    ClientFilePortService,
    ClientUserPortService,
    GKDLockService
  ],
  exports: [
    ClientAuthPortService, // ::
    ClientChatPortService,
    ClientDirPortService,
    ClientFilePortService,
    ClientUserPortService
  ]
})
export class ClientPortModule {}
