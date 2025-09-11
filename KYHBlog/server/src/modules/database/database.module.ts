import {Module} from '@nestjs/common'
import {DBHubModule} from './dbHub'
import {GKDLockModule, GKDLockService} from '@module/gkdLock'

import * as P from './ports'

@Module({
  imports: [
    DBHubModule, // ::
    P.ClientPortModule,
    P.JwtPortModule,
    P.SocketPortModule
  ],
  controllers: [],
  providers: [
    P.ClientAuthPortService, // ::
    P.ClientChatPortService,
    P.ClientDirPortService,
    P.ClientFilePortService,
    P.ClientUserPortService,
    P.JwtPortService,
    P.SocketPortService,
    GKDLockService
  ],
  exports: [
    P.ClientAuthPortService, // ::
    P.ClientChatPortService,
    P.ClientDirPortService,
    P.ClientFilePortService,
    P.ClientUserPortService,
    P.JwtPortService,
    P.SocketPortService
  ]
})
export class DatabaseModule {}
