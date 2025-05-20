import {Module} from '@nestjs/common'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {LoggerModule} from 'src/modules/logger/logger.module'
import {ClientMembersController} from './client.members.controller'
import {ClientMembersService} from './client.members.service'

@Module({
  imports: [
    DatabaseModule, // BLANK LINE COMMENT:
    GKDJwtModule,
    LoggerModule
  ],
  controllers: [ClientMembersController],
  providers: [ClientMembersService],
  exports: [ClientMembersService]
})
export class ClientMembersModule {}
