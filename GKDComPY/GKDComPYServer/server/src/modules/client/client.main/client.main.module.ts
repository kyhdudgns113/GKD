import {Module} from '@nestjs/common'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {ClientMainController} from './client.main.controller'
import {ClientMainService} from './client.main.service'
import {LoggerModule} from 'src/modules/logger/logger.module'

@Module({
  imports: [
    DatabaseModule, // BLANK LINE COMMENT:
    GKDJwtModule,
    LoggerModule
  ],
  controllers: [ClientMainController],
  providers: [ClientMainService],
  exports: [ClientMainService]
})
export class ClientMainModule {}
