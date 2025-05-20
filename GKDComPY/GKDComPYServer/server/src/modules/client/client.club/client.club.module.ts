import {Module} from '@nestjs/common'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {ClientClubController} from './client.club.controller'
import {ClientClubService} from './client.club.service'
import {LoggerModule} from 'src/modules/logger/logger.module'

@Module({
  imports: [
    DatabaseModule, // BLANK LINE COMMENT:
    GKDJwtModule,
    LoggerModule
  ],
  controllers: [ClientClubController],
  providers: [ClientClubService],
  exports: [ClientClubService]
})
export class ClientClubModule {}
