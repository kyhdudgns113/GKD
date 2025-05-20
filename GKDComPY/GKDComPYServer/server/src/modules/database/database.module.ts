import {Module} from '@nestjs/common'
import * as P from './ports'
import {DatabaseHubModule} from './databaseHub'
import {GKDLockModule} from '../gkdLock/gkdLock.module'

@Module({
  imports: [
    DatabaseHubModule,
    GKDLockModule,
    P.AdminPortModule, // BLANK LINE COMMENT:
    P.ClientPortModule,
    P.JwtPortModule,
    P.LoggerPortModule,
    P.PokerPortModule
  ],
  controllers: [],
  providers: [
    P.AdminPortService,
    P.ClientPortService,
    P.JwtPortService,
    P.LoggerPortService,
    P.PokerPortService
  ],
  exports: [
    P.AdminPortService,
    P.ClientPortService,
    P.JwtPortService,
    P.LoggerPortService,
    P.PokerPortService
  ]
})
export class DatabaseModule {}
