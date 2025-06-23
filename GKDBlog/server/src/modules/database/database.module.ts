import {Module} from '@nestjs/common'
import {GKDLockModule} from '@modules/gkdLock'
import {DatabaseHubModule} from './databaseHub'

import * as P from './ports'

@Module({
  imports: [
    DatabaseHubModule, // ::
    GKDLockModule,
    P.ClientPortModule,
    P.JwtPortModule,
    P.LoggerPortModule,
    P.SocketPortModule
  ],
  controllers: [],
  providers: [P.JwtPortService, P.LoggerPortService, P.ClientPortService, P.SocketPortService],
  exports: [P.JwtPortService, P.LoggerPortService, P.ClientPortService, P.SocketPortService]
})
export class DatabaseModule {}
