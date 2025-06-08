import {Module} from '@nestjs/common'
import {GKDLockModule} from '@modules/gkdLock'
import {DatabaseHubModule} from './databaseHub'

import * as P from './ports'

@Module({
  imports: [
    DatabaseHubModule, // BLANK LINE COMMENT:
    GKDLockModule,
    P.ClientPortModule,
    P.JwtPortModule,
    P.LoggerPortModule
  ],
  controllers: [],
  providers: [P.JwtPortService, P.LoggerPortService, P.ClientPortService],
  exports: [P.JwtPortService, P.LoggerPortService, P.ClientPortService]
})
export class DatabaseModule {}
