import {Module} from '@nestjs/common'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {ClientChatController} from './client.chat.controller'
import {ClientChatService} from './client.chat.service'
import {LoggerModule} from 'src/modules/logger/logger.module'

@Module({
  imports: [DatabaseModule, GKDJwtModule, LoggerModule],
  controllers: [ClientChatController],
  providers: [ClientChatService, CheckJwtValidationGuard],
  exports: [ClientChatService]
})
export class ClientChatModule {}
