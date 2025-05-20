import {Module} from '@nestjs/common'
import * as P from './ports'
import {DatabaseHubModule} from './databaseHub'
import {GKDLockModule} from '../gkdLock/gkdLock.module'

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
