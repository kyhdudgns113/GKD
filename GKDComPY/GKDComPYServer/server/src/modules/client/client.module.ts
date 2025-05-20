import {Module} from '@nestjs/common'

import {DatabaseModule} from '../database/database.module'
import {GKDJwtModule} from '../gkdJwt/gkdJwt.module'

import {ClientController} from './client.controller'
import {ClientService} from './client.service'
import {ClientMainModule} from './client.main/client.main.module'
import {ClientClubModule} from './client.club/client.club.module'
import {ClientChatModule} from './client.chat/client.chat.module'
import {ClientDocModule} from './client.doc/client.doc.module'
import {LoggerModule} from '../logger/logger.module'
import {ClientRecordModule} from './client.record/client.record.module'
import {ClientMembersModule} from './client.members/client.members.module'

@Module({
  imports: [
    ClientChatModule,
    ClientClubModule,
    ClientDocModule,
    ClientMainModule,
    ClientMembersModule,
    ClientRecordModule,
    DatabaseModule, // BLANK LINE COMMENT:
    GKDJwtModule,
    LoggerModule
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}
